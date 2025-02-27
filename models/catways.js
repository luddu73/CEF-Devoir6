const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *  schemas:
 *      Catway:
 *          type: object
 *          required:
 *              - catwayNumber
 *              - catwayType
 *              - catwayState
 *          properties:
 *              catwayNumber:
 *                  type: number
 *                  description: Le numéro de catway réservé
 *              catwayType:
 *                  type: string
 *                  description: Le type de catway (long ou court)
 *                  enum: [long, short]
 *              catwayState: 
 *                  type: string
 *                  description: Champ libre permettant de faire un commentaire sur l'état du catway
 *          example:
 *              catwayNumber: "12"
 *              catwayType: "long"
 *              catwayState: "Quelques fissures sur le quai"
 */

const Catway = new Schema({
    catwayNumber: {
        type: Number,
        trim: true,
        unique: true,
        required: [true, 'Un numéro de catway est requis']
    },
    catwayType: {
        type: String,
        trim : true,
        required: [true, 'Le type du catway doit être "long" ou "court"'],
        enum: ['long', 'short']
    },
    catwayState: {
        type: String,
        trim: true,
        required: [true, "L'état du catway doit être renseigné."]
    }
});


module.exports = mongoose.model('catways', Catway);