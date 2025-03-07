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
 * @returns {Response} Retourne une réponse JSON avec la liste des catways ou une erreur
 */
exports.getAll = async (req, res, next) => {
    try {
        let catways = await Catway.find().sort({ catwayNumber: 1 });

        if (catways.length > 0) {
           // return res.status(200).json(catways);
            res.locals.catways = catways;
            return next();
        }
        console.log("Aucun catways trouvé");
        res.locals.catways = 0;
        res.errorMessage = "Aucun catways trouvé";
        return next();
    } catch (error) {
        // Code erreur de MongoDB de duplication
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
 * @returns {Response} Retourne une réponse JSON avec les infos du catway ou une erreur
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
 * @returns {Response} Retourne une réponse JSON avec le catway crée ou une erreur
 */
exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    });

    if (temp.catwayNumber < 1 || !Number.isInteger(Number(temp.catwayNumber))) {
        return res.redirect('/catways?error=ADD_1');
    }
    let catwayExist = await Catway.findOne({ catwayNumber: temp.catwayNumber });
    if (catwayExist) {
        return res.redirect('/catways?error=ADD_3');
       // return res.status(400).json({error: "Ce catway existe déjà."});
    }

    if (temp.catwayType !== "short" && temp.catwayType !== "long") {
        return res.redirect('/catways?error=ADD_2');
        //return res.status(400).json({ error: "Le type doit être court ou long."});
    }

    if (!temp.catwayState) {
        return res.redirect('/catways?error=ADD_4')
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
 * Permet de mettre à jour un catway
 * @async
 * @function update
 * @param {object} req - Objet de la requête avec les données du catway à mettre à jour.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON avec les données de catway mise à jour ou une erreur
 */
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        catwayState: req.body.state
    });

    try {
        let catway = await Catway.findOne({catwayNumber : id});

        if (catway) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    catway[key] = temp[key];
                }
            });

            await catway.save();
            return res.status(201).json(catway);
        }

        return res.status(404).json('Catway non trouvé');
    } catch (error) {
        return res.status(501).json(error)
    } 
}

/**
 * Permet de supprimer un catway
 * @async
 * @function delete
 * @param {object} req - Objet de la requête avec le numéro de catway à supprimer.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction middleware suivante
 * @returns {Response} Retourne une réponse JSON qui supprime le catway ou affiche une erreur
 */
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catway.findOne({ catwayNumber: id });

        if (catway) {
            await Catway.deleteOne({catwayNumber: id});
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