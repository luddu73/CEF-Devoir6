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
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    // On vérifie que le token commence par 'Bearer '
    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('Token de sécurité invalide');
            } else {
                req.decoded = decoded;

                // Génération d'un token pour continuer notre session
                const expiresIn = process.env.JWT_EXPIRE * 60 * 60;
                const newToken = jwt.sign({
                    user : decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                // Ajout du token crée dans l'header
                res.header('Authorization', 'Bearer ' + newToken);
                next();
            }
        });
    } else {
        return res.status(401).json('Token de sécurité nécessaire');
    }
}