var express = require('express');
var router = express.Router();

const serviceReservation = require('../services/reservations');

// Import du middleware pour privatisation
const private = require('../middlewares/private');

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
    let message = null;

    // Définir le message de succès basé sur le code
    switch (successCode) {
        case "ADD":
            message = "Utilisateur créé avec succès.";
            break;
    }

    // Définir le message d'erreur basé sur le code
    switch (errorCode) {
        case "ADD_1":
            errorMessageCreate = "Le nom d'utilisateur doit être renseigné.";
            break;
        default:
            errorMessageCreate = errorCode;
            break;
    }

    res.render('reservations', { 
        currentPage: 'reservations',
        errorMessageCreate: errorMessageCreate,
        message: message,
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
router.get('/:idReservation', private.checkJWT, serviceReservation.checkReservationExists, serviceReservation.getById);

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
 *          description: "Réservation non trouvée"
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
