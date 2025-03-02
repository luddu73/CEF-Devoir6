/**
 * @file Middleware pour vérifier et refraîchir un token JWT.
 * @module middlewares/private
 */

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Vérifie l'existance et la validité du token JWT dans l'header des requêtes
 * - Si le token est valide, il est décodé et rattaché à req.decoded
 * - On créer un nouveau token renvoyé dans l'header "Authorization" pour continuer la session
 * @param {object} req - Objet de la requête Express
 * @param {object} res - Objet de réponse Express
 * @param {function} next - Fonction suivante
 * @returns {response} Renvoi un 404 en cas d'échec, sinon on passe à la fonction suivante.
 */
exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie('jwt'); // Supprime le cookie si invalide
                // return res.status(401).json('Token de sécurité invalide');
                return res.render('index');
                //return res.render('error', { errorCode:"401", title:"Token de sécurité invalide", message: 'Vous devez vous reconnecter.' });
            } else {
                req.user = decoded.user; 
                res.locals.user = decoded.user; // Rend accessible l'utilisateur dans EJS
                next();
            }
        });
    } else {
        res.locals.user = null;
        return res.render('index');
        //return res.render('error', { errorCode:"401", title:"Token de sécurité nécessaire", message: 'Vous devez vous reconnecter.' });
        //return res.status(401).json('Token de sécurité nécessaire');
        next();
    }
}