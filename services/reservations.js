const Reservation = require('../models/reservations');
const Catway = require('../models/catways');

// Module qui vérifie l'existance du catway avant les réservations
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

// Callback qui récupère toutes les réservations
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
// Callback qui récupère toutes les réservations d'un catway
exports.getByCatway = async (req, res, next) => {
    const id = req.params.id;

    try {
        let reservations = await Reservation.find({ catwayNumber: id });

        if (reservations) {
            return res.status(200).json(reservations);
        }

        return res.status(404).json('Aucune réservation trouvée pour ce catway');
    } catch (error) {
        return res.status(501).json(error);
    }
}
// Callback qui récupère les infos d'une réservation précise
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
// Callback qui récupère les infos d'une réservation précise
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

// Fonction qui vérifie si des réservations sont déjà présentes sur un catway
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


// Callback de création d'une réservation
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
// Callback qui modifier une réservation
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
// Callback qui permet de supprimer une réservation
exports.delete = async (req, res, next) => {
    const idReservation = req.params.idReservation

    try {
        await Reservation.deleteOne({_id : idReservation});

        return res.status(204).json('Réservation supprimée');
    } catch (error) {
        return res.status(501).json(error)
    } 
}