const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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