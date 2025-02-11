var express = require('express');
var router = express.Router();

const service = require('../services/users');

// Import du middleware pour privatisation
const private = require('../middlewares/private');

// Route d'authentification
router.post('/authenticate', service.authenticate);

module.exports = router;
