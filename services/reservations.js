/**
 * @file Les différents services de l'API pour la gestion des réservations
 * @module services/reservations
 */

const Reservation = require('../models/reservations');
const Catway = require('../models/catways');
const mongoose = require('mongoose');


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
            return res.redirect('/reservations?error=ADD_5')
        }

        req.catway = catway;
        next();
    }
    catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.code === 11000) {
            req.session.formData = req.body;
            return res.redirect(`/catways?error=ADD_3`);
        }
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
    }
}
/**
 * Module qui vérifie l'existance d'une réservation sur un catway
 * @async
 * @function checkCatwayExists
 * @param {object} req - Objet de la requête avec le numéro de réservation et de catway à rechercher.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec une erreur, ou qui valide l'existance de la réservation sur le catway choisi
 */
exports.checkReservationCatwayExists = async (req, res, next) => {
    
    const id = req.params.id || req.body.catwayNumber;
    const objectIdReservation = req.params.idReservation;
    if (!mongoose.Types.ObjectId.isValid(objectIdReservation)) {
        return res.status(400).json({ error: "L'id Reservation est invalide." });
    }

    try {
        const idReservation = new mongoose.Types.ObjectId(objectIdReservation);

        const reservation = await Reservation.findOne({ catwayNumber: id, _id: idReservation });

        if (!reservation) {
            return res.status(404).json('Réservation non trouvée sur ce catway');
        }

        req.reservation = reservation;
        next();
    }
    catch (error) {
        return res.status(501).json(error);
    }
}
/**
 * Module qui vérifie l'existance d'une réservation
 * @async
 * @function checkCatwayExists
 * @param {object} req - Objet de la requête avec le numéro de réservation à rechercher.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec une erreur, ou qui valide l'existance de la réservation
 */
exports.checkReservationExists = async (req, res, next) => {
    
    const objectIdReservation = req.params.idReservation;
    console.log("Paramètre reçu :", req.params.idReservation);
    if (!mongoose.Types.ObjectId.isValid(objectIdReservation)) {
        return res.status(400).json({ error: "L'id Reservation est invalide." });
    }

    try {
        const idReservation = new mongoose.Types.ObjectId(objectIdReservation);

        const reservation = await Reservation.findOne({ _id: idReservation });

        if (!reservation) {
            return res.status(404).json('Réservation non trouvée');
        }

        req.reservation = reservation;
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
        let reservations = await Reservation.find().sort({ endDate:-1, startDate:-1 });

        if (reservations.length > 0) {
            res.locals.reservations = reservations;
            return next();
        }

        console.log("Aucune réservation trouvée");
        res.locals.users = users;
        res.errorMessage = "Aucune réservation trouvée";
        return next();
    } catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
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

        if (reservations.length > 0) {
            return res.status(200).json(reservations);
        }

        return res.status(404).json('Aucune réservation trouvée pour ce catway');
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
    const idReservation = req.params.idReservation;
    try {
        
        const idReservation = new mongoose.Types.ObjectId(req.params.idReservation);

        let reservations = await Reservation.find({ _id: idReservation });

        if (reservations.length > 0) {
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
 * @param {string} catwayType - Le type de catway attendu
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
        throw error;
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
        endDate: req.body.endDate,
        catwayType: req.body.catwayType
    });
    console.log('Date envoyée par le body : ', temp.startDate, temp.endDate);

    let DateDebut = new Date(temp.startDate);
    let DateFin = new Date(temp.endDate);
    let DateAct = new Date();
    console.log("Date transformée : ", DateDebut, DateFin);

    if (isNaN(DateDebut) || isNaN(DateFin)) {
        console.error("Erreur : Date invalide détectée !");
        return res.redirect('/reservations?error=DATE_INVALID');
    }
    if(!temp.clientName || !temp.boatName || !temp.startDate || !temp.endDate || !temp.catwayType)
    {
        req.session.formData = req.body;
        return res.redirect('/reservations?error=ADD_1');
        //return res.status(400).json({ error: "Les champs doivent tous être renseignés."});
    }
    if (DateDebut <= DateAct) {
        req.session.formData = req.body;
        return res.redirect('/reservations?error=ADD_2');
        //return res.status(400).json({ error: "La date de début doit être ultérieure à la date actuelle."});
    }
    if (DateDebut > DateFin) {
        req.session.formData = req.body;
        return res.redirect('/reservations?error=ADD_3');
        //return res.status(400).json({ error: "La date de début ne peut être postérieure à la date de fin."});
    }

    try {
        const presentReservation = await checkReservation(temp.catwayNumber, DateDebut, DateFin);
        if (presentReservation) {
            req.session.formData = req.body;
            return res.redirect('/reservations?error=ADD_4');
            //return res.status(400).json({ error: "Une réservation existe déjà sur ce créneau." });
        }
        let reservation = await Reservation.create(temp);
        req.session.formData = null;
        return res.redirect('/reservations?success=ADD');
        //return res.status(201).json(reservation);
    } catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
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
    const idReservation = req.params.idReservation;
    if (!mongoose.Types.ObjectId.isValid(idReservation)) {
        return res.status(400).json({ error: 'L\'id Reservation est invalide.' });
    }
    const temp = ({
        catwayNumber: req.params.id || req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    if(!temp.clientName || !temp.boatName || !temp.startDate || !temp.endDate)
    {
        return res.status(400).json({ error: "Les champs doivent tous être renseignés."});
    }

    let DateDebut = new Date(temp.startDate).toISOString();
    let DateFin = new Date(temp.endDate).toISOString();
    let DateAct = new Date().toISOString();
    
    if (DateDebut <= DateAct) {
        return res.status(400).json({ error: "La date de début doit être ultérieure à la date actuelle."});
    }
    if (DateDebut > DateFin) {
        return res.status(400).json({ error: "La date de début ne peut être postérieure à la date de fin."});
    }

    const presentReservation = await checkReservation(temp.catwayNumber, temp.startDate, temp.endDate);
    if (presentReservation) {
        return res.status(400).json({ error: "Une réservation existe déjà sur ce créneau." });
    }

    try {
        const idReservation = new mongoose.Types.ObjectId(req.params.idReservation);

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