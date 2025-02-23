var express = require('express');
var router = express.Router();

const service = require('../services/catways');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

// Route pour lister les catways
router.get('/', service.getAll);
// Route pour récupérer les infos d'un catway
router.get('/:id', service.getById);
// Route pour créer un catway
router.post('/', service.add);
// La route pour modifier un catway
router.put('/:id', service.update);
// La route pour supprimer un catway
router.delete('/:id', service.delete);

module.exports = router;
