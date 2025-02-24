/**
 * @file Schéma Mongoose pour la collection "catways"
 * @module models/catways
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Il définit la structure de la base de donnée des catways
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Le numéro de catway (requis et unique)
 * @property {string} catwayType - Le type de catway (long ou court)
 * @property {string} catwayState - Champ libre permettant de faire un commentaire sur l'état du catway
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