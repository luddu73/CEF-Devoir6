var express = require('express');
var router = express.Router();

const service = require('../services/users');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

// Route pour lister les utilisateurs
router.get('/', service.getAll);
// Route pour récupérer les infos d'un utilisateur
router.get('/:email', service.getByEmail);
// Route pour créer un utilisateur
router.post('/', service.add);
// La route pour modifier un utilisateur
router.put('/:email', service.update);
// La route pour supprimer un utilisateur
router.delete('/:email', service.delete);
// Route d'authentification
router.post('/login', service.authenticate);

module.exports = router;
