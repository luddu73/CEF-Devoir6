const Reservation = require('../models/reservations');
const Catway = require('../models/catways');

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
        let reservation = await Reservation.create(temp);

        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(501).json(error)
    }
}