/**
 * @swagger
 * tags:
 *      name: "Users"
 *      description: "Gestion des utilisateurs"
 */

var express = require('express');
var router = express.Router();

const service = require('../services/users');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - "Users"
 *     summary: "Récupère tous les utilisateurs"
 *     description: "Cette route permet de récupérer la liste de tous les utilisateurs."
 *     responses:
 *       200:
 *         description: "Liste des utilisateurs récupérée avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *       404:
 *          description: "Aucun utilisateur trouvé"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/', service.getAll);


/**
 * @swagger
 * /users/{email}:
 *   get:
 *     tags:
 *       - "Users"
 *     summary: "Récupère un utilisateur avec son email"
 *     description: "Cette route permet de récupérer un utilisateur en utilisant son adresse email."
 *     parameters:
 *       - name: "email"
 *         in: "path"
 *         required: true
 *         description: "Email de l'utilisateur à rechercher."
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Utilisateur trouvé."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *       404:
 *         description: "Utilisateur non trouvé."
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:email', service.getByEmail);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - "Users"
 *     summary: "Ajoute un nouvel utilisateur"
 *     description: "Cette route permet de créer un nouvel utilisateur avec un nom d'utilisateur, un email et un mot de passe."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "P@ssw0rd!"
 *     responses:
 *       201:
 *         description: "Utilisateur créé avec succès."
 *       400:
 *         description: "Mauvaise requête (email ou mot de passe invalide)."
 *       501:
 *         description: "Erreur serveur."
 */
router.post('/', service.add);

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     tags:
 *       - "Users"
 *     summary: "Modifie un utilisateur avec son email"
 *     description: "Cette route permet de mettre à jour un utilisateur en l'identifiant avec son adresse email."
 *     parameters:
 *       - name: "email"
 *         in: "path"
 *         required: true
 *         description: "Email de l'utilisateur à modifier."
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "P@ssw0rd!"
 *     responses:
 *       201:
 *         description: "Utilisateur modifié avec succès."
 *       400:
 *         description: "Mauvaise requête (email ou mot de passe invalide)."
 *       404:
 *         description: "Utilisateur non trouvé."
 *       501:
 *         description: "Erreur serveur."
 */
router.put('/:email', service.update);

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     tags:
 *       - "Users"
 *     summary: "Supprime un utilisateur avec son email"
 *     description: "Cette route permet de supprimer un utilisateur en l'identifiant avec son adresse email."
 *     parameters:
 *       - name: "email"
 *         in: "path"
 *         required: true
 *         description: "Email de l'utilisateur à supprimer."
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: "Utilisateur supprimé."
 *       501:
 *         description: "Erreur serveur."
 */
router.delete('/:email', service.delete);


/**
 * @swagger
 * /users/login:
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
 *       403:
 *         description: "Identifiants incorrects"
 *       404:
 *         description: "Utilisateur non trouvé"
 *       501:
 *         description: "Erreur serveur"
 */
router.post('/login', service.authenticate);

module.exports = router;
