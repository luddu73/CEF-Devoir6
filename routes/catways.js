/**
 * @swagger
 * tags:
 *      name: "Catways"
 *      description: "Gestion des catways"
 */

/**
 * @swagger
 * tags:
 *      name: "Reservations"
 *      description: "Gestion des réservations"
 */

var express = require('express');
var router = express.Router();

const service = require('../services/catways');
const serviceReservation = require('../services/reservations');

// Import du middleware pour privatisation
const private = require('../middlewares/private');

/**
 * @swagger
 * /catways:
 *   get:
 *     tags:
 *       - "Catways"
 *     summary: "Récupère tous les catways"
 *     description: "Cette route permet de récupérer la liste de tous les catways."
 *     responses:
 *       200:
 *         description: "Liste des catways récupérée avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   catwayNumber:
 *                     type: number
 *                   catwayType:
 *                     type: string
 *                     enum: [long, short]
 *                   catwayState:
 *                     type: string
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Aucun catway trouvé"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/', private.checkJWT, service.getAll, function(req, res, next) {
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessageCreate = null;
    let message = null;

    switch (successCode) {
        case "ADD":
            message = "Catway crée avec succès.";
            break;
        case "DEL":
            message = "Catway supprimé avec succès.";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "ADD_1":
            errorMessageCreate = "Le catway doit être un nombre entier supérieur à 0.";
            break;
        case "ADD_2":
            errorMessageCreate = "Le catway ne peut être que long, ou court.";
            break;
        case "ADD_3":
            errorMessageCreate = "Ce numéro de catway existe déjà.";
            break;
        case "ADD_4":
            errorMessageCreate = "Un état de catway doit être précisé.";
            break;
        case "DEL_1":
            errorMessage = "Catway introuvable.";
            break;
        case "UPD_1":
            errorMessage = "Catway introuvable.";
            break;
        default:
            errorMessageCreate = errorCode;
            break;
    }

    res.render('catways', { 
        currentPage: 'catways',
        errorMessageCreate: errorMessageCreate,
        message: message,
        formData: req.session.formData  // Passe formData dans la vue
      });
});


/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     tags:
 *       - "Catways"
 *     summary: "Récupère un catway"
 *     description: "Cette route permet de récupérer un catway particulier à partir de son numéro."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway à récupérer."
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: "Catway récupéré avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   catwayNumber:
 *                     type: number
 *                   catwayType:
 *                     type: string
 *                     enum: [long, short]
 *                   catwayState:
 *                     type: string
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Catway non trouvé"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:id', private.checkJWT, service.getById, function(req, res, next) {
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessage = null;
    let message = null;

    switch (successCode) {
        case "UPD":
            message = "Catway modifié avec succès.";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "UPD_1":
            errorMessage = "Vous devez renseigner un état.";
            break;
        default:
            errorMessage = errorCode;
            break;
    }

    res.render('catway', { 
        currentPage: 'catways',
        errorMessage: errorMessage,
        message: message,
        formData: req.session.formData  // Passe formData dans la vue
      });
});

/**
 * @swagger
 * /catways:
 *   post:
 *     tags:
 *       - "Catways"
 *     summary: "Ajoute un catway"
 *     description: "Cette route permet de créer un catway avec un numéro, un type (long ou court) et un état."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - type
 *               - state
 *             properties:
 *               number:
 *                 type: number
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [long, short]
 *                 example: "long"
 *               state:
 *                 type: string
 *                 example: "Quelques fissures sur le quai"
 *     responses:
 *       201:
 *         description: "Catway créé avec succès."
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       400:
 *         description: "Le type doit être court ou long."
 *       501:
 *         description: "Erreur serveur."
 */
router.post('/', private.checkJWT, service.add);

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     tags:
 *       - "Catways"
 *     summary: "Modifie un catway"
 *     description: "Cette route permet de modifier un catway en l'identifiant avec son numéro."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway à modifier."
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 example: "Quelques fissures sur le quai"
 *     responses:
 *       201:
 *         description: "Catway modifié avec succès."
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *         description: "Catway non trouvé."
 *       501:
 *         description: "Erreur serveur."
 */
router.put('/:id', private.checkJWT, service.update);

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     tags:
 *       - "Catways"
 *     summary: "Supprime un catway"
 *     description: "Cette route permet de supprimer un catway en l'identifiant avec son numéro."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway à supprimer."
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: "Catway supprimé avec succès."
 *       404:
 *          description: "Catway non trouvé."
 *       501:
 *         description: "Erreur serveur."
 */
router.delete('/:id', private.checkJWT, service.delete);


/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     tags:
 *       - "Reservations"
 *     summary: "Récupère toutes les réservations d'un catway"
 *     description: "Cette route permet de récupérer la liste de toutes les réservation d'un catway particulier à partir de son numéro."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway choisi."
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: "Liste des réservations du catway récupérée avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   catwayNumber:
 *                     type: number
 *                   clientName:
 *                     type: string
 *                   boatName:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Catway non trouvé ou aucune réservation trouvée sur ce catway"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:id/reservations', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.getByCatway);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     tags:
 *       - "Reservations"
 *     summary: "Récupère une réservation spécifique d'un catway"
 *     description: "Cette route permet de récupérer une réservation à partir de son ID et du numéro du catway."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway choisi."
 *         schema:
 *           type: number
 *       - name: "idReservation"
 *         in: "path"
 *         required: true
 *         description: "ID de la réservation recherchée."
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Réservation récupérée avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   catwayNumber:
 *                     type: number
 *                   clientName:
 *                     type: string
 *                   boatName:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Catway non trouvé ou aucune réservation trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:id/reservations/:idReservation', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.checkReservationCatwayExists, serviceReservation.getById);

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     tags:
 *       - "Reservations"
 *     summary: "Ajoute une nouvelle réservation sur un catway choisi"
 *     description: "Cette route permet de créer une nouvelle réservation avec un nom de client, nom de bateau, une date de début et une date de fin. Le catway est choisi via son numéro dans les paramètres."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway choisi."
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *                   clientName:
 *                     type: string
 *                     example: "John Doe"
 *                   boatName:
 *                     type: string
 *                     example: "Titanic"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-20"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-21"
 *     responses:
 *       201:
 *         description: "Réservation créé avec succès."
 *       400:
 *         description: "Mauvaise requête (erreur dans les dates ou réservation déjà présente sur le créneau choisi)."
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Catway non trouvé"
 *       501:
 *         description: "Erreur serveur."
 */
router.post('/:id/reservations', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.add);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     tags:
 *       - "Reservations"
 *     summary: "Modifie une réservation précise"
 *     description: "Cette route permet de modifier réservation identifiée via son ID ainsi que le numéro de catway."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway choisi."
 *         schema:
 *           type: number
 *       - name: "idReservation"
 *         in: "path"
 *         required: true
 *         description: "ID de la réservation recherchée."
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   catwayNumber:
 *                     type: number
 *                     example: 1
 *                   clientName:
 *                     type: string
 *                     example: "John Doe"
 *                   boatName:
 *                     type: string
 *                     example: "Titanic"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-20"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-21"
 *     responses:
 *       201:
 *         description: "Réservation modifiée avec succès."
 *       400:
 *         description: "Mauvaise requête (erreur dans les dates ou réservation déjà présente sur le créneau choisi)."
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *         description: "Réservation non trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.put('/:id/reservations/:idReservation', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.checkReservationCatwayExists, serviceReservation.update);
/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     tags:
 *       - "Reservations"
 *     summary: "Supprime une réservation précise"
 *     description: "Cette route permet de supprimer une réservation identifiée via son ID ainsi que le numéro de catway."
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         description: "Numéro du catway choisi."
 *         schema:
 *           type: number
 *       - name: "idReservation"
 *         in: "path"
 *         required: true
 *         description: "ID de la réservation recherchée."
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: "Réservation supprimée avec succès."
 *       400:
 *          description: "L'id de réservation n'est pas valide"
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "La réservation ou le catway n'a pas été trouvé."
 *       501:
 *         description: "Erreur serveur."
 */
router.delete('/:id/reservations/:idReservation', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.checkReservationCatwayExists, serviceReservation.delete);



module.exports = router;
