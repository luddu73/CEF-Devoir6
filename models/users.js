const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * Schéma Mongoose pour la collection "users"
 * 
 * Il définit la structure de la base de donnée utilisateur
 * @typedef {Object} User
 * @property {string} username - Le nom d'utilisateur (requis)
 * @property {string} email - L'adresse email (requise et unique)
 * @property {string} password - Le mot de passe hashé de l'utilisateur (requis. Doit avoir au moins 8 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial)
 */

const User = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Un nom d\'utilisateur est requis']
    },
    email: {
        type: String,
        trim : true,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'L\'adresse email n\'est pas valide.']
    },
    password: {
        type: String,
        trim: true,
        minLength: [8, 'Le mot de passe doit avoir au moins 8 caractères.'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'Le mot de passe doit contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.']
    }
});
/**
 * Middleware exécuté avant la sauvegarde d'un utilisateur.
 * Si le mot de passe a été modifié, il est haché avant d'être enregistré.
 */
User.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('users', User);