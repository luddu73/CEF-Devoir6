var express = require('express');
var router = express.Router();

const serviceReservation = require('../services/reservations');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

// Route pour lister les réservation
router.get('/', serviceReservation.getAll);
// Route pour récupérer les infos d'une réservation
router.get('/:id', serviceReservation.getById);
// Route pour créer une réservation sur un catway
router.post('/', serviceReservation.checkCatwayExists, serviceReservation.add);

module.exports = router;
