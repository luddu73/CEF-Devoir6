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
// Route pour modifier une réservation sur un catway
router.put('/:idReservation', serviceReservation.checkCatwayExists, serviceReservation.update);
// Route pour supprimer une réservation sur un catway
router.delete('/:idReservation', serviceReservation.checkCatwayExists, serviceReservation.delete);

module.exports = router;
