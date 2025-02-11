const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

// Hash du mot de passe en cas de modification
User.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('users', User);