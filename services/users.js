/**
 * @file Les différents services de l'API pour la gestion des utilisateurs
 * @module services/users
 */

const User = require('../models/users');
const bcrypt = require('bcrypt');


/**
 * Vérifie la présentation du nom d'utilisateur (lettre Majuscule et minuscule uniquement)
 * @async
 * @function checkEmail
 * @param {string} username - L'input à vérifier
 * @returns {boolean} Retourne une réponse "true" si le nom d'utilisateur est conforme, sinon "false"
 */
const checkUsername = (username) => {
    const usernameRegex  = /^[A-Za-z]+$/;
    return usernameRegex.test(username);
};

/**
 * Vérifie la présentation de l'email
 * @async
 * @function checkEmail
 * @param {string} email - L'email à vérifier
 * @returns {boolean} Retourne une réponse "true" si l'email est conforme, sinon "false"
 */
const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Vérifie la sécurité du mot de passe (1 majuscule, 1 miniscule, 1 chiffre et 1 caractère spécial)
 * @async
 * @function checkPassword
 * @param {string} password - Le mot de passe à vérifier
 * @returns {boolean} Retourne une réponse "true" si le mot de passe est conforme, sinon "false"
 */
const checkPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return passwordRegex.test(password);
};

/**
 * Vérifie la longueur du mot de passe (8 caractères minimum)
 * @async
 * @function checkPasswordLength
 * @param {string} password - Le mot de passe à vérifier
 * @returns {boolean} Retourne une réponse "true" si le mot de passe est conforme, sinon "false"
 */
const checkPasswordLength = (password) => {
    return password.length >= 8;
};

/**
 * Permet de créer un nouvel utilisateur
 * @async
 * @function add
 * @param {object} req - Objet de la requête avec les données de l'utilisateur à créer.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec l'utilisateur crée ou une erreur
 */
exports.add = async (req, res, next) => {
    const temp = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    if (!temp.username)
    {
        //return res.status(400).json({ error: "Le nom d'utilisateur doit être renseigné"});
        req.session.formData = req.body;
        return res.redirect('/users?error=ADD_1');
    }
    if (!checkUsername(temp.username)) {
        //return res.status(400).json({ error: "Le nom d'utilisateur ne peut contenir que des lettres."});
        req.session.formData = { username: req.body.username, email: req.body.email };
        return res.redirect('/users?error=ADD_2');
    }
    if (!checkEmail(temp.email)) {
        //return res.status(400).json({ error: "Adresse email invalide."});
        req.session.formData = req.body;
        return res.redirect('/users?error=ADD_3');
    }
    if (!checkPassword(temp.password)) {
        //return res.status(400).json({ error: "Le mot de passe doit contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."});
        req.session.formData = req.body;
        return res.redirect('/users?error=ADD_4');
    }
    if (!checkPasswordLength(temp.password)) {
        //return res.status(400).json({ error: "Le mot de passe doit avoir au moins 8 caractères."});
        req.session.formData = req.body;
        return res.redirect('/users?error=ADD_4');
    }
    if (temp.password != temp.confirmPassword) {
        //return res.status(400).json({ error: "Les mots de passe ne correspondent pas."});
        req.session.formData = req.body;
        return res.redirect('/users?error=ADD_5');
    }

    try {
        let user = await User.create(temp);

        //return res.status(201).json(user);
        req.session.formData = null;
        return res.redirect('/users?success=ADD');
    } catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.code === 11000) {
            req.session.formData = req.body;
            return res.redirect(`/users?error=ADD_6`);
        }
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
    }
}

/**
 * Permet de récupérer tous les utilisateurs.
 * @async
 * @function getAll
 * @param {object} req - Objet de la requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec la liste des utilisateurs ou une erreur
 */
exports.getAll = async (req, res, next) => {
    try {
        let users = await User.find();

        if (users.length > 0) {
            //return res.status(200).json(users);
            res.locals.users = users;
            return next();
        }

        //return res.status(404).json('Aucun utilisateur trouvé');
        console.log("Aucun utilisateur trouvé");
        res.locals.users = users;
        res.errorMessage = "Aucun utilisateur trouvé";
        return next();
    } catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.code === 11000) {
            req.session.formData = req.body;
            return res.redirect(`/users?error=ADD_6`);
        }
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
    }
}
/**
 * Permet de récupérer les données d'un utilisateur grâce à son adresse email.
 * @async
 * @function getByEmail
 * @param {object} req - Objet de la requête Express contenant l'email dans les paramètres.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec les données de l'utilisateur ou une erreur
 */
exports.getByEmail = async (req, res, next) => {
    const email = req.params.email

    try {
        let user = await User.findOne({ email });

        if (user) {
            //return res.status(200).json(user);
            res.locals.user = user;
            return next();
        }

        return res.redirect(`/users?error=USR_1`);
    } catch (error) {
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
    }
}
/**
 * Met à jour les données d'un utilisateur en l'identifiant par son adresse email.
 * @async
 * @function update
 * @param {object} req - Objet de la requête Express contenant les nouveaux paramètres à appliquer à l'utilisateur.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec les données de l'utilisateur mise à jour ou une erreur
 */
exports.update = async (req, res, next) => {
    const email = req.params.email
    const temp = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    if (!temp.username)
    {
        return res.redirect(`/users/${email}?error=UPD_1`);
       // return res.status(400).json({ error: "Le nom d'utilisateur doit être renseigné"});
    }
    if (!checkUsername(temp.username)) {
        return res.redirect(`/users/${email}?error=UPD_2`);
        //return res.status(400).json({ error: "Le nom d'utilisateur ne peut contenir que des lettres."});
    }
    if (!checkEmail(temp.email)) {
        return res.redirect(`/users/${email}?error=UPD_3`);
        //return res.status(400).json({ error: "Adresse email invalide."});
    }
    if (temp.password && !checkPassword(temp.password)) {
        return res.redirect(`/users/${email}?error=UPD_4`);
        //return res.status(400).json({ error: "Le mot de passe doit contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."});
    }
    if (temp.password && !checkPasswordLength(temp.password)) {
        return res.redirect(`/users/${email}?error=UPD_4`);
        //return res.status(400).json({ error: "Le mot de passe doit avoir au moins 8 caractères."});
    }
    if (temp.password != temp.confirmPassword) {
        return res.redirect(`/users/${email}?error=UPD_5`);
        //return res.status(400).json({ error: "Le mot de passe doit avoir au moins 8 caractères."});
    }

    try {
        let user = await User.findOne({email : email});

        if (user) {
            if (!temp.password) {
                delete temp.password;
            }
            Object.assign(user, temp);

            if (req.session.email === req.params.email)
            {
                req.session.user = temp.username;
                req.session.email = temp.email;
            }

            await user.save({ validateModifiedOnly: true });
            //return res.status(201).json(user);
            return res.redirect(`/users/${temp.email}?success=UPD`);
        }
        return res.redirect('/users?error=USR_1');
        //return res.status(404).json('Utilisateur non trouvé');
    } catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.code === 11000) {
            req.session.formData = req.body;
            return res.redirect(`/users/${email}?error=UPD_6`);
        }
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
    }
}

/**
 * Supprime un utilisateur en l'identifiant par son adresse email.
 * @async
 * @function delete
 * @param {object} req - Objet de la requête Express contenant l'email à supprimer dans les paramètres.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON ou une erreur
 */
exports.delete = async (req, res, next) => {
    const email = req.params.email
    const currentSession = req.user?.email;

    try {
        if (email === currentSession) {
            console.warn(`⚠️ L'Utilisateur ${email} essais de supprimer son propre compte.`);
            return res.json({success: false, errorInfo: "DEL_2"});
        }

        let user = await User.findOne({ email: email });
        
        if (user) {
            await User.deleteOne({email: email});
            return res.json({success: true});
        }
        console.warn(`Utilisateur ${email} non trouvé.`);
        return res.json({success: false, errorInfo: "DEL_1"}); // Utilisateur non trouvé

    } catch (error) {
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            console.error(error);
            req.session.formData = null;
            // Erreur avec la base de donnée, renvoi vers la page d'erreur
            return res.render(`error`, {
                errorCode: '503',
                title: 'Erreur de base de donnée',
                message: 'Nous rencontrons des difficultés à contacter la base de données, réessayez plus tard.'
            })
        }
        //return res.status(501).json(error)
        // Si une erreur non spécifique se produit, envoyer vers page d'erreur standard
        console.error(error);
        req.session.formData = null;
        return res.render(`error`, {
            errorCode: '500',
            title: 'Erreur Interne',
            message: 'Une erreur inattendue est survenue sur le serveur. Veuillez réessayer plus tard.'
        })
    }
}