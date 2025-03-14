/**
 * @swagger
 * tags:
 *      name: "Users"
 *      description: "Gestion des utilisateurs"
 */

var express = require('express');
var router = express.Router();
const session = require('express-session'); 

const service = require('../services/users');

// Import du middleware pour privatisation
const private = require('../middlewares/private');



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
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Aucun utilisateur trouvé"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/', private.checkJWT, service.getAll, function(req, res, next) {
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessageCreate = null;
    let message = null;

    // Définir le message de succès basé sur le code
    switch (successCode) {
        case "ADD":
            message = "Utilisateur créé avec succès.";
            break;
        case "DEL":
            message = "Utilisateur supprimé";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "ADD_1":
            errorMessageCreate = "Le nom d'utilisateur doit être renseigné.";
            break;
        case "ADD_2":
            errorMessageCreate = "Le nom d'utilisateur ne peut contenir que des lettres.";
            break;
        case "ADD_3":
            errorMessageCreate = "Adresse email invalide.";
            break;
        case "ADD_4":
            errorMessageCreate = "Le mot de passe doit avoir au moins 8 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.";
            break;
        case "ADD_5":
            errorMessageCreate = "Les mots de passe ne correspondent pas.";
            break;
        case "ADD_6":
            errorMessageCreate = "Cette adresse email existe déjà dans le système.";
            break;
        case "DEL_1":
            errorMessage = "L'utilisateur à supprimer n'a pas été trouvé dans le système.";
            break;
        case "DEL_2":
            errorMessage = "Vous ne pouvez pas supprimer votre propre compte.";
            break;
        case "USR_1":
            errorMessage = "L'utilisateur souhaité est introuvable.";
            break;
        default:
            errorMessageCreate = errorCode;
            break;
    }

    res.render('users', { 
        currentPage: 'users',
        errorMessageCreate: errorMessageCreate,
        message: message,
        formData: req.session.formData  // Passe formData dans la vue
      });
});


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
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *         description: "Utilisateur non trouvé."
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:email', private.checkJWT, service.getByEmail, function(req, res, next) {
    
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessage = null;
    let message = null;

    // Définir le message de succès basé sur le code
    switch (successCode) {
        case "UPD":
            message = "Utilisateur modifié avec succès.";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "UPD_1":
            errorMessage = "Le nom d'utilisateur doit être renseigné.";
            break;
        case "UPD_2":
            errorMessage = "Le nom d'utilisateur ne peut contenir que des lettres.";
            break;
        case "UPD_3":
            errorMessage = "Adresse email invalide.";
            break;
        case "UPD_4":
            errorMessage = "Le mot de passe doit avoir au moins 8 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.";
            break;
        case "UPD_5":
            errorMessage = "Les mots de passe ne correspondent pas.";
            break;
        case "UPD_6":
            errorMessage = "Cette adresse email existe déjà dans le système.";
            break;
        default:
            errorMessage = errorCode;
            break;
    }

    res.render('user', { 
        currentPage: 'users',
        backPage: 'users',
        errorMessage: errorMessage,
        message: message,
        formData: req.session.formData  // Passe formData dans la vue
      });
});

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
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       400:
 *         description: "Mauvaise requête (email ou mot de passe invalide)."
 *       409:
 *         description: "Conflit. Cette adresse email existe déjà dans le système."
 *       501:
 *         description: "Erreur serveur."
 */
router.post('/', private.checkJWT, service.add);

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
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       400:
 *         description: "Mauvaise requête (email ou mot de passe invalide)."
 *       404:
 *         description: "Utilisateur non trouvé."
 *       409:
 *         description: "Conflit. Cette adresse email existe déjà dans le système."
 *       501:
 *         description: "Erreur serveur."
 */
router.put('/:email', private.checkJWT, service.update);

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
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Utilisateur non trouvé"
 *       409:
 *          description: "Vous ne pouvez pas supprimer votre propre compte."
 *       501:
 *         description: "Erreur serveur."
 */
router.delete('/:email', private.checkJWT, service.delete);

module.exports = router;
