/**
 * @file Les différents services de l'API pour la connexion et deconnexion des utilisateurs
 * @module services/access
 */
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/**
 * Authentifie un utilisateur en vérifiant l'email et le mot de passe
 * @async
 * @function authenticate
 * @param {object} req - Objet de la requête avec les données de l'utilisateur qui souhaite se connecté.
 * @param {object} res - L'objet de réponse Express.
 * @param {Function} next - La fonction middleware suivante
 * @returns {Response} Répond avec un token JWT si authentification correct, ou une erreur
 */
exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body; // On récupère l'email et le password proposé

    if (!email || !password)
    {
        //return res.status(400).json('Un des champs n\'est pas renseigné.');
        return res.render('index', { errorMessage: 'Les champs sont obligatoires.' });
    }
    try {
        let user = await User.findOne({ email: email}, '-__v -createdAt -updatedAt'); // On cherche l'user avec l'email

        if (user) {
            bcrypt.compare(password, user.password, function(err, response) { // On contrôle le mdp saisie avec la BDD
                if (err) {
                    throw new Error(err); // Si faux, on ressort une erreur
                }
                if (response) {
                    // Supprimer le mot de passe de l'utilisateur avant de l'envoyer
                    delete user._doc.password;
                    
                    const expireIn = process.env.JWT_EXPIRE * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });

                    // Création du cookie de sécurisation
                    res.cookie('jwt', token, {
                        httpOnly: true, // Empêche l'accès depuis JavaScript
                        secure: process.env.NODE_ENV === 'production', // Active seulement en HTTPS
                        maxAge: expireIn, // Durée de validité
                        sameSite: 'Strict'
                    });
                    //return res.status(200).json('Authentification réussie');
                    req.user = user;
                    res.locals.user = user; // Disponible dans EJS
                    return res.render('index', { message: 'Authentification réussie. Vous allez être redirigé !' });
                }

                //return res.status(403).json('Mot de passe incorrect');
                return res.render('index', { errorMessage: 'Mot de passe incorrect.' });
            });
        } else {
            //return res.status(404).json('Utilisateur inexistant');
            return res.render('index', { errorMessage: 'Utilisateur inexistant.' });
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}


/**
 * Déconnecte l'utilisateur et supprime les cookies liés
 * @async
 * @function logout
 * @param {object} req - Objet de la requête.
 * @param {object} res - L'objet de réponse Express.
 * @param {Function} next - La fonction middleware suivante
 * @returns {Response} Réponse ou erreur JSON
 */
exports.logout = (req, res) => {
    res.clearCookie('jwt'); // Supprime le cookie JWT
    res.redirect('/'); // Redirige vers la page d'accueil
};