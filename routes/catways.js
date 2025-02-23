var express = require('express');
var router = express.Router();

const service = require('../services/catways');
const serviceReservation = require('../services/reservations');

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


// Route pour lister les réservations d'un catway
router.get('/:id/reservations', serviceReservation.getByCatway);
// Route pour lister les infos d'une réservation d'un catway
router.get('/:id/reservations/:idReservation', serviceReservation.getByIdAndCatway);
// Route pour créer une réservation sur un catway
router.post('/:id/reservations/', serviceReservation.checkCatwayExists, serviceReservation.add);
// Route pour modifier une réservation sur un catway
router.put('/:id/reservations/:idReservation', serviceReservation.checkCatwayExists, serviceReservation.update);
// Route pour supprimer une réservation sur un catway
router.delete('/:id/reservations/:idReservation', serviceReservation.checkCatwayExists, serviceReservation.delete);



module.exports = router;
