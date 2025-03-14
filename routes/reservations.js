var express = require('express');
var router = express.Router();

const serviceReservation = require('../services/reservations');

const session = require('express-session'); 
// Import du middleware pour privatisation
const private = require('../middlewares/private');
const Catway = require('../models/catways');

/**
 * @swagger
 * /reservations:
 *   get:
 *     tags:
 *       - "Reservations"
 *     summary: "Récupère toutes les réservations"
 *     description: "Cette route permet de récupérer la liste de toutes les réservation."
 *     responses:
 *       200:
 *         description: "Liste des réservations récupérée avec succès."
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
 *          description: "Aucune réservation trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/', private.checkJWT, serviceReservation.getAll, function(req, res, next) {
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessageCreate = null;
    let errorMessage = null;
    let message = null;
    const today = new Date().toISOString().split('T')[0];

    // Définir le message de succès basé sur le code
    switch (successCode) {
        case "ADD":
            message = "Réservation créée avec succès.";
            break;
        case "DEL":
            message = "Réservation supprimée avec succès.";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "ADD_1":
            errorMessageCreate = "Les champs doivent tous être renseignés.";
            break;
        case "ADD_2":
            errorMessageCreate = "La date de début doit être ultérieure à la date actuelle.";
            break;
        case "ADD_3":
            errorMessageCreate = "La date de début ne peut être postérieure à la date de fin.";
            break;
        case "ADD_4":
            errorMessageCreate = "Une réservation existe déjà sur ce catway.";
            break;
        case "ADD_5":
            errorMessageCreate = "Le catway choisi est introuvable.";
            break;
        case "DATE_INVALID":
            errorMessageCreate = "Les dates envoyées ne sont pas valides.";
            break;
        case "DEL_1":
            errorMessage = "La réservation à supprimer n'a pas été trouvée.";
            break;
        case "RSV_1":
            errorMessage = "La réservation n'a pas été trouvée.";
            break;
        default:
            errorMessageCreate = errorCode;
            break;
    }

    res.render('reservations', { 
        currentPage: 'reservations',
        errorMessageCreate: errorMessageCreate,
        errorMessage: errorMessage,
        message: message,
        today: today,
        formData: req.session.formData  // Passe formData dans la vue
      });
});

/**
 * @swagger
 * /reservations/{idReservation}:
 *   get:
 *     tags:
 *       - "Reservations"
 *     summary: "Récupère une réservation spécifique"
 *     description: "Cette route permet de récupérer une réservation à partir de son ID."
 *     parameters:
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
 *       400:
 *          description: "L'ID de réservation ressort un format non valide"
 *       401:
 *          description: "Token de sécurité invalide ou inexistant"
 *       404:
 *          description: "Réservation non trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:idReservation', private.checkJWT, serviceReservation.checkReservationExists, serviceReservation.getById, function(req, res, next) {
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessageCreate = null;
    let errorMessage = null;
    let message = null;
    const today = new Date().toISOString().split('T')[0];

    // Définir le message de succès basé sur le code
    switch (successCode) {
        case "PUT":
            message = "Réservation modifiée avec succès.";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "UPD_1":
            errorMessageCreate = "Les champs doivent tous être renseignés.";
            break;
        case "UPD_2":
            errorMessageCreate = "La date de début doit être ultérieure à la date actuelle.";
            break;
        case "UPD_3":
            errorMessageCreate = "La date de début ne peut être postérieure à la date de fin.";
            break;
        case "UPD_4":
            errorMessageCreate = "Une réservation existe déjà sur ce catway.";
            break;
        case "UPD_5":
            errorMessageCreate = "Le catway choisi est introuvable.";
            break;
        case "DATE_INVALID":
            errorMessageCreate = "Les dates envoyées ne sont pas valides.";
            break;
        case "DEL_1":
            errorMessage = "La réservation à supprimer n'a pas été trouvée.";
            break;
        default:
            errorMessageCreate = errorCode;
            break;
    }

    res.render('reservation', { 
        currentPage: 'reservations',
        errorMessageCreate: errorMessageCreate,
        errorMessage: errorMessage,
        message: message,
        today: today,
        formData: req.session.formData  // Passe formData dans la vue
      });
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     tags:
 *       - "Reservations"
 *     summary: "Ajoute une nouvelle réservation"
 *     description: "Cette route permet de créer une nouvelle réservation avec un numéro de catway, un nom de client, nom de bateau, une date de début et une date de fin."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
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
router.post('/', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.add);

/**
 * @swagger
 * /reservations/{idReservation}:
 *   put:
 *     tags:
 *       - "Reservations"
 *     summary: "Modifie une réservation précise"
 *     description: "Cette route permet de modifier réservation identifiée via son ID."
 *     parameters:
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
router.put('/:idReservation', private.checkJWT, serviceReservation.checkCatwayExists, serviceReservation.checkReservationExists, serviceReservation.update);

/**
 * @swagger
 * /reservations/{idReservation}:
 *   delete:
 *     tags:
 *       - "Reservations"
 *     summary: "Supprime une réservation précise"
 *     description: "Cette route permet de supprimer une réservation identifiée via son ID."
 *     parameters:
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
router.delete('/:idReservation', private.checkJWT, serviceReservation.checkReservationExists, serviceReservation.delete);

module.exports = router;
