/**
 * @file Les différents services de l'API pour la gestion des réservations
 * @module services/reservations
 */

const Reservation = require('../models/reservations');
const Catway = require('../models/catways');


/**
 * Module qui vérifie l'existance du catway avant les réservations
 * @async
 * @function checkCatwayExists
 * @param {object} req - Objet de la requête avec le numéro de catway à rechercher.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec une erreur, ou qui valide l'existance du catway
 */
exports.checkCatwayExists = async (req, res, next) => {
    
    const id = req.params.id || req.body.catwayNumber;

    try {
        const catway = await Catway.findOne({ catwayNumber: id });

        if (!catway) {
            return res.status(404).json('Catway non trouvé');
        }

        req.catway = catway;
        next();
    }
    catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Permet de récupérer la liste des réservations
 * @async
 * @function getAll
 * @param {object} req - Objet de la requête.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec la liste des réservations ou une erreur
 */
exports.getAll = async (req, res, next) => {
    try {
        let reservations = await Reservation.find();

        if (reservations) {
            return res.status(200).json(reservations);
        }

        return res.status(404).json('Aucune réservation trouvée');
    } catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Permet de récupérer les réservations d'un catway en particulier
 * @async
 * @function getByCatway
 * @param {object} req - Objet de la requête avec le numéro de catway rattaché.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec la liste des réservation du catway ou une erreur
 */
exports.getByCatway = async (req, res, next) => {
    const id = req.params.id;

    try {
        let reservations = await Reservation.find({ catwayNumber: id });

        if (reservations) {
            return res.status(200).json(reservations);
        }

        return res.status(405).json('Aucune réservation trouvée pour ce catway');
    } catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Permet de récupérer les informations d'une réservation précise
 * @async
 * @function getById
 * @param {object} req - Objet de la requête avec le numéro de réservation à rechercher.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec les données de la réservation ou une erreur
 */
exports.getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        let reservations = await Reservation.findById(id);

        if (reservations) {
            return res.status(200).json(reservations);
        }

        return res.status(404).json('Aucune réservation trouvée');
    } catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Permet de récupérer les infos d'une réservation et d'un catway précis
 * @async
 * @function getByIdAndCatway
 * @param {object} req - Objet de la requête avec les données du catway et de réservation à rechercher.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec les infos de la réservation ou une erreur
 */
exports.getByIdAndCatway = async (req, res, next) => {
    const id = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        let reservations = await Reservation.find({ catwayNumber: id, _id: idReservation });

        if (reservations) {
            return res.status(200).json(reservations);
        }

        return res.status(404).json('Aucune réservation trouvée');
    } catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Fonction qui vérifie si des réservations sont déjà présentes sur un catway
 * @async
 * @function checkReservation
 * @param {number} catwayNumber - Numéro du catway choisi
 * @param {Date} startDate - Date de début de la réservation souhaitée.
 * @param {Date} endDate - Date de fin de la réservation souhaitée.
 * @returns {Response} Retourne une réponse JSON qui indique la présence ou non d'une réservation sur la période choisie ou une erreur
 */
const checkReservation = async (catwayNumber, startDate, endDate) => {
    try {
        const presentReservation = await Reservation.findOne({ 
            catwayNumber: catwayNumber,
            $or: [
                { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }, // On vérifie si startdate est < à une date de fin et si une date de fin est > à une date de début, entraînant un cheveauchement
                { startDate: { $eq: new Date(startDate) } }, // Date de début identique
                { endDate: { $eq: new Date(endDate) } } // Même date de fin
            ]
        });

        return presentReservation;
    } catch (error) {
        return res.status(501).json(error);
    }
}

/**
 * Permet de créer une nouvelle réservation
 * @async
 * @function add
 * @param {object} req - Objet de la requête avec les données de la réservation à créer.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec la réservation créee ou une erreur
 */
exports.add = async (req, res, next) => {
    
    const temp = ({
        catwayNumber: req.params.id || req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    if (temp.startDate > temp.endDate) {
        return res.status(400).json({ error: "La date de début ne peut être postérieure à la date de fin."});
    }

    try {
        const presentReservation = await checkReservation(temp.catwayNumber, temp.startDate, temp.endDate);
        if (presentReservation) {
            return res.status(400).json({ error: "Une réservation existe déjà sur ce créneau." });
        }
        let reservation = await Reservation.create(temp);

        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(501).json(error);
        console.log(error);
    }
}

/**
 * Permet de modifier une réservation
 * @async
 * @function update
 * @param {object} req - Objet de la requête avec les données de la réservation à mettre à jour.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec la réservation mise à jour ou une erreur
 */
exports.update = async (req, res, next) => {
    const idReservation = req.params.idReservation
    const temp = ({
        catwayNumber: req.params.id || req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    if (temp.startDate > temp.endDate) {
        return res.status(400).json({ error: "La date de début ne peut être postérieure à la date de fin."});
    }

    try {
        const presentReservation = await checkReservation(temp.catwayNumber, temp.startDate, temp.endDate);
        if (presentReservation) {
            return res.status(400).json({ error: "Une réservation existe déjà sur ce créneau." });
        }

        let reservation = await Reservation.findOne({_id : idReservation});

        if (reservation) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    reservation[key] = temp[key];
                }
            });

            await reservation.save();
            return res.status(201).json(reservation);
        }

        return res.status(404).json('Réservation non trouvée');
    } catch (error) {
        return res.status(501).json(error)
    } 
}

/**
 * Permet de supprimer une réservation
 * @async
 * @function delete
 * @param {object} req - Objet de la requête avec les données de la réservation à supprimer.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec la réservation supprimée ou une erreur
 */
exports.delete = async (req, res, next) => {
    const idReservation = req.params.idReservation

    try {
        await Reservation.deleteOne({_id : idReservation});

        return res.status(204).json('Réservation supprimée');
    } catch (error) {
        return res.status(501).json(error)
    } 
}