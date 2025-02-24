var express = require('express');
var router = express.Router();

const serviceReservation = require('../services/reservations');

// Import du middleware pour privatisation
// PAS ENCORE UTILISER const private = require('../middlewares/private');

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
 *       404:
 *          description: "Aucune réservation trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/', serviceReservation.getAll);

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
 *           type: number
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
 *       404:
 *          description: "Catway non trouvé ou aucune réservation trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.get('/:id', serviceReservation.getById);

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
 *       501:
 *         description: "Erreur serveur."
 */
router.post('/', serviceReservation.checkCatwayExists, serviceReservation.add);

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
 *           type: number
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
 *       404:
 *         description: "Réservation non trouvée"
 *       501:
 *         description: "Erreur serveur."
 */
router.put('/:idReservation', serviceReservation.checkCatwayExists, serviceReservation.update);

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
 *           type: number
 *     responses:
 *       204:
 *         description: "Réservation supprimée avec succès."
 *       501:
 *         description: "Erreur serveur."
 */
router.delete('/:idReservation', serviceReservation.checkCatwayExists, serviceReservation.delete);

module.exports = router;
