/**
 * @file Définition des routes pour la gestion des utilisateurs.
 * @module routes/users
 */

var express = require('express');
var router = express.Router();

const service = require('../services/users');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

/**
 * @route GET /
 * @description Récupère la liste de tous les utilisateurs.
 * @group Utilisateurs
 * @returns {Object} 200 - Liste des utilisateurs.
 * @returns {Error} 404 - Aucun utilisateur trouvé.
 */
router.get('/', service.getAll);

/**
 * @route GET /
 * @description Récupère un utilisateur par son adresse email.
 * @group Utilisateurs
 * @param {string} email - Adresse email de l'utilisateur recherché.
 * @returns {Object} 200 - Liste des utilisateurs.
 * @returns {Error} 404 - Aucun utilisateur trouvé.
 */
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
