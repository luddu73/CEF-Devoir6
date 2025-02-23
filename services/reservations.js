const Reservation = require('../models/reservations');

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