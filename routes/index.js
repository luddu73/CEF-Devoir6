/**
 * @swagger
 * tags:
 *   name: Error
 *   description: Gestion des erreurs de l'application
 */

var express = require('express');
var router = express.Router();
// Import du middleware pour privatisation
const private = require('../middlewares/private');

/* GET home page. */
router.get('/', private.checkJWT, function(req, res, next) {
  const errorMessage = "";
  const message = "";
  res.render('index');
});

router.get('/legals', private.checkJWT, function(req, res, next) {
  const errorMessage = "";
  const message = "";
  res.render('legals');
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
 *     responses:
 *       200:
 *         description: "Déconnexion réussie"
 *       500:
 *         description: "Erreur serveur"
 */
router.get('/logout', service.logout);

/**
 * @swagger
 * /error:
 *   get:
 *     tags:
 *       - "Error"
 *     summary: "Affiche une page d'erreur"
 *     description: "Affiche une page d'erreur avec un message et un code d'erreur personnalisés."
 *     parameters:
 *       - name: errorCode
 *         in: query
 *         description: "Code d'erreur (par défaut 500)"
 *         required: false
 *         schema:
 *           type: string
 *           example: "500"
 *       - name: title
 *         in: query
 *         description: "Titre de l'erreur"
 *         required: false
 *         schema:
 *           type: string
 *           example: "Erreur inconnue"
 *       - name: message
 *         in: query
 *         description: "Message détaillé de l'erreur"
 *         required: false
 *         schema:
 *           type: string
 *           example: "Une erreur est survenue."
 *     responses:
 *       200:
 *         description: "Page d'erreur affichée avec succès"
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html>Erreur affichée</html>"
 *       500:
 *         description: "Erreur serveur"
 */
router.get('/error', (req, res) => {
  const { errorCode, title, message } = req.query;
  
  res.render('error', {
      errorCode: errorCode || '500',
      title: title || 'Erreur inconnue',
      message: message || 'Une erreur est survenue.',
  });
});

module.exports = router;
