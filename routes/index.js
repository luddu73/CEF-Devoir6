var express = require('express');
var router = express.Router();
// Import du middleware pour privatisation
const private = require('../middlewares/private');

/* GET home page. */
router.get('/', private.checkJWT, function(req, res, next) {
  const errorMessage = "";
  const message = "";
  res.render('index', { title: 'Express' });
});

const service = require('../services/access');


/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - "Users"
 *     summary: "Connecte un utilisateur"
 *     description: "Vérifie l'email et le mot de passe fournis, puis génère un token JWT en cas de succès."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MotDePasse123!"
 *     responses:
 *       200:
 *         description: "Authentification réussie"
 *         headers:
 *           Authorization:
 *             description: "Token JWT renvoyé dans l'en-tête pour les requêtes futures"
 *             schema:
 *               type: string
 *       400:
 *         description: "Un des champs n'est pas renseigné"
 *       403:
 *         description: "Mot de passe incorrect"
 *       404:
 *         description: "Utilisateur inexistant"
 *       501:
 *         description: "Erreur serveur"
 */
router.post('/login', service.authenticate);

/**
 * @swagger
 * /logout:
 *   get:
 *     tags:
 *       - "Users"
 *     summary: "Déconnecte un utilisateur"
 *     description: "Déconnecte l'utilisateur en supprimant les cookies de sécurité JWT."
 */
router.get('/logout', service.logout);

router.get('/error', (req, res) => {
  const { errorCode, title, message } = req.query;
  
  res.render('error', {
      errorCode: errorCode || '500',
      title: title || 'Erreur inconnue',
      message: message || 'Une erreur est survenue.',
  });
});

module.exports = router;
