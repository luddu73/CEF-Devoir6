const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - username
 *              - email
 *              - password
 *          properties:
 *              username:
 *                  type: string
 *                  description: Le nom d'utilisateur
 *              email:
 *                  type: string
 *                  description: L'adresse email de l'utilisateur (doit être unique)
 *              password: 
 *                  type: string
 *                  description: Mot de passe hashé de l'utilisateur (doit contenir 8 caractères minimum dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial)
 *          example:
 *              username: "JohnDoe"
 *              email: "john.doe@example.com"
 *              password: "$2b$10$abc123hashedpassw0rd"
 */

const User = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Un nom d\'utilisateur est requis'],
        match: [/^[A-Za-z]+$/, 'Le nom d\'utilisateur n\'est pas valide.']
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