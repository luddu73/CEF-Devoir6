/**
 * @file Les différents services de l'API pour la gestion des catways
 * @module services/catways
 */

const Catway = require('../models/catways');

/**
 * Permet récupérer la liste des catways
 * @async
 * @function getAll
 * @param {object} req - Objet de la requête.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} - Renvoie la réponse avec la liste des catways ou une erreur
 */
exports.getAll = async (req, res, next) => {
    try {
        let catways = await Catway.find().sort({ catwayNumber: 1 });

        if (catways.length > 0) {
            res.locals.catways = catways;
            return next();
        }
        console.log("Aucun catways trouvé");
        res.locals.catways = 0;
        res.errorMessage = "Aucun catways trouvé";
        return next();
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
 * Permet de récupérer les informations d'un catway grâce à son numéro
 * @async
 * @function getById
 * @param {object} req - Objet de la requête avec le numéro du catway à chercher.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} - Renvoie les informations du catway ou une redirection vers une erreur.
 */
exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catway.findOne({ catwayNumber: id });

        if (catway) {
            res.locals.catways = catway;
            return next();
        }

        return res.redirect('/catways?error=UPD_1'); // Catway non trouvé
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
 * Permet d'ajouter un catway
 * @async
 * @function add
 * @param {object} req - Objet de la requête avec les données du catway à créer.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} - Renvoie une redirection après ajout ou une erreur en cas de problème.
 */
exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    });

    if (temp.catwayNumber < 1 || !Number.isInteger(Number(temp.catwayNumber))) {
        return res.redirect('/catways?error=ADD_1'); // Le catway doit être supérieur à 1 et entier
    }
    let catwayExist = await Catway.findOne({ catwayNumber: temp.catwayNumber });
    if (catwayExist) {
        return res.redirect('/catways?error=ADD_3'); // Le catway existe déjà
    }

    if (temp.catwayType !== "short" && temp.catwayType !== "long") {
        return res.redirect('/catways?error=ADD_2'); // Le type doit être court ou long
    }

    if (!temp.catwayState) {
        return res.redirect('/catways?error=ADD_4'); // L'état du catway doit être précisé
    }

    try {
        let catway = await Catway.create(temp);

        req.session.formData = null;
        return res.redirect('/catways?success=ADD');
    } catch (error) {
        // Code erreur de MongoDB de duplication
        if (error.code === 11000) {
            req.session.formData = req.body;
            return res.redirect(`/catways?error=ADD_3`);
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
 * Permet de mettre à jour un catway
 * @async
 * @function update
 * @param {object} req - Objet de la requête avec les données du catway à mettre à jour.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} - Renvoie une redirection après mise à jour ou une erreur en cas de problème.
 */
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        catwayState: req.body.catwayState
    });

    if (!temp.catwayState) {
        return res.redirect(`/catways/${id}?error=UPD_1`); // Il faut renseigner un état
    }

    try {
        let catway = await Catway.findOne({catwayNumber : id});

        if (catway) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    catway[key] = temp[key];
                }
            });

            await catway.save();
            return res.redirect(`/catways/${id}?success=UPD`);
        }

        return res.redirect('/catways?error=UDP_1');
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
 * Permet de supprimer un catway
 * @async
 * @function delete
 * @param {object} req - Objet de la requête avec le numéro de catway à supprimer.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} - Renvoie une réponse de suppression ou une erreur.
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catway.findOne({ catwayNumber: id });
        console.log(res.locals.canDelete);

        if (res.locals.canDelete == false) {
            return res.json({success: false, errorInfo: "DEL_2"}); // Catway non trouvé
        }
        if (catway) {
          //  await Catway.deleteOne({catwayNumber: id});
            return res.json({success: true});
        }
        console.warn(`Catway ${catwayNumber} non trouvé.`);
        return res.json({success: false, errorInfo: "DEL_1"}); // Catway non trouvé
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