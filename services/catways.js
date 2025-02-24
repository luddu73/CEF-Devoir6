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
        let catways = await Catway.find();

        if (catways) {
            return res.status(200).json(catways);
        }

        return res.status(404).json('Aucun catways trouvé');
    } catch (error) {
        return res.status(501).json(error);
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
            return res.status(200).json(catway);
        }

        return res.status(404).json('Catway non trouvé');
    } catch (error) {
        return res.status(501).json(error);
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
        catwayNumber: req.body.number,
        catwayType: req.body.type,
        catwayState: req.body.state
    });

    if (temp.catwayType !== "short" && temp.catwayType !== "long") {
        return res.status(400).json({ error: "Le type doit être court ou long."});
    }

    try {
        let catway = await Catway.create(temp);

        return res.status(201).json(catway);
    } catch (error) {
        return res.status(501).json(error)
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
        await Catway.deleteOne({catwayNumber : id});

        return res.status(204).json('Catway supprimé');
    } catch (error) {
        return res.status(501).json(error)
    } 
}