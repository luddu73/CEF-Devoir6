const Catway = require('../models/catways');

// Callback qui récupère tout les catways
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
// Callback qui récupère les informations selon le numéro de catway
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
// Callback de création d'un catway
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

// Callback qui modifier un catway
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
// Callback qui permet de supprimer un catway
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await Catway.deleteOne({catwayNumber : id});

        return res.status(204).json('Catway supprimé');
    } catch (error) {
        return res.status(501).json(error)
    } 
}