var express = require('express');
var router = express.Router();

const service = require('../services/reservations');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

// Route pour lister les réservation
router.get('/', service.getAll);
// Route pour récupérer les infos d'une réservation
router.get('/:id', service.getById);

module.exports = router;
