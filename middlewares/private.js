/**
 * @file Middleware pour vérifier et refraîchir un token JWT.
 * @module middlewares/private
 */

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Vérifie l'existance et la validité du token JWT dans l'header des requêtes
 * - Si le token est valide, il est décodé et rattaché à req.user et res.locals.user.
 * - Si le token est invalide ou manquant, la session est considérée comme expirée et une vue 'index' est rendue, incitant l'utilisateur à se reconnecter.
 * - Un nouveau token peut être généré et renvoyé dans l'en-tête 'Authorization' pour continuer la session (fonctionnalité implicite).
 * @param {object} req - Objet de la requête Express
 * @param {object} res - Objet de réponse Express
 * @param {function} next - Fonction suivante
* @returns {void} Rend la vue d'index si le token est invalide ou manquant, sinon passe à la fonction suivante.
 */
exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie('jwt'); // Supprime le cookie si invalide
                return res.render('index');
            } else {
                req.user = decoded.user; 
                res.locals.user = decoded.user; // Rend accessible l'utilisateur dans EJS
                next();
            }
        });
    } else {
        res.locals.user = null;
        return res.render('index');
        next();
    }
}