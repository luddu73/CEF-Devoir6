const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = new Schema({
    catwayNumber: {
        type: Number,
        trim: true,
        required: [true, 'Un numéro de catway est requis']
    },
    clientName: {
        type: String,
        trim : true,
        required: [true, "Le nom du client doit être renseigné"]
    },
    boatName: {
        type: String,
        trim : true,
        required: [true, "Le nom du bâteau doit être renseigné"]
    },
    startDate: {
        type: Date,
        trim: true,
        required: [true, "La date de début de la réservation doit être renseignée."]
    },
    endDate: {
        type: Date,
        trim: true,
        required: [true, "La date de fin de la réservation doit être renseignée."]
    }
});


module.exports = mongoose.model('reservations', Reservation);