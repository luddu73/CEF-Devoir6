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
        required: [true, "La date de début de la réservation doit être renseignée."],
        validate: {
            validator: function (startDate) {
                const actualDate = new Date();
                actualDate.setHours(0, 0, 0, 0); // Remise à zéro de l'heure
                return startDate >= actualDate;
            },
            message: "La date de début ne peut être postérieure à aujourd'hui."
        }
    },
    endDate: {
        type: Date,
        trim: true,
        required: [true, "La date de fin de la réservation doit être renseignée."],
        validate: {
            validator: function (endDate) {
                return this.startDate <= endDate; // J'impose que la date de fin soit supérieur à la date de début
            },
            message: "La date de fin doit être postérieure à la date de début.",
        }
    }
});


module.exports = mongoose.model('reservations', Reservation);