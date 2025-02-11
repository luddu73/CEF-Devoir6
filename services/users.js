const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body; // On récupère l'email et le password proposé

    try {
        let user = await User.findOne({ email: email}, '-__v -createdAt -updatedAt'); // On cherche l'user avec l'email

        if (user) {
            bcrypt.compare(password, user.password, function(err, response) { // On contrôle le mdp saisie avec la BDD
                if (err) {
                    throw new Error(err); // Si faux, on ressort une erreur
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 24 * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });

                    res.header('Authorization', 'Bearer ' + token);
                    
                    return res.status(200).json('authenticate_succeed');
                }

                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}

// Création d'une fonction pour valider la présentation de l'email 
const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
// Création d'une fonction qui vérifie et valide la sécurité du mot de passe
const checkPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/;
    return passwordRegex.test(password);
};
// Création d'une fonction qui vérifie et valide la longueur du mot de passe
const checkPasswordLength = (password) => {
    return password.length >= 8;
};

// Callback de création d'un utilisateur
exports.add = async (req, res, next) => {

    const temp = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    if (!checkEmail(email)) {
        return res.status(400).json({ error: "Adresse email invalide."});
    }
    if (!checkPassword(password)) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."});
    }
    if (!checkPasswordLength(email)) {
        return res.status(400).json({ error: "Le mot de passe doit avoir au moins 8 caractères."});
    }

    try {
        let user = await User.create(temp);

        return res.status(201).json(user);
    } catch (error) {
        return res.status(501).json(error)
    }
}