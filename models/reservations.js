const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *  schemas:
 *      Reservation:
 *          type: object
 *          required:
 *              - catwayNumber
 *              - clientName
 *              - boatName
 *              - startDate
 *              - endDate
 *          properties:
 *              catwayNumber:
 *                  type: number
 *                  description: Le numéro de catway réservé
 *              clientName:
 *                  type: string
 *                  description: Le nom du client pour qui le catway est réservé
 *              boatName: 
 *                  type: string
 *                  description: Le nom du bâteau du client pour qui le catway est réservé
 *              startDate:
 *                  type: date
 *                  description: Date de début de la réservation
 *              endDate:
 *                  type: date
 *                  description: Date de fin de la réservation
 *          example:
 *              catwayNumber: "12"
 *              clientName: "John Doe"
 *              boatName: "Titanic"
 *              startDate: "2025-02-02"
 *              endDate: "2025-02-17"
 */

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
                if (this.isModified('startDate')) {
                    const actualDate = new Date();
                    actualDate.setHours(0, 0, 0, 0); // Remise à zéro de l'heure
                    return startDate >= actualDate;
                }
                return true;
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

Reservation.index({ catwayNumber: 1 });  // On créer un index pour améliorer les performances, car on recherche souvent par catway. 1 signifie croissant.

module.exports = mongoose.model('reservations', Reservation);