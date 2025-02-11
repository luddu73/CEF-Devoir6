const User = require('../models/user');
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