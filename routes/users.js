var express = require('express');
var router = express.Router();

const service = require('../services/users');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

// Route pour créer un utilisateur
router.put('/add', service.add);
// Route d'authentification
router.post('/authenticate', service.authenticate);

module.exports = router;
