var express = require('express');
var router = express.Router();

const serviceReservation = require('../services/reservations');
const Catway = require('../models/catways');
const Reservation = require('../models/reservations');

const session = require('express-session'); 
// Import du middleware pour privatisation
const private = require('../middlewares/private');


/**
 * @swagger
 * /available:
 *   get:
 *     tags:
 *       - "Reservations"
 *     summary: "Recherche les catways disponibles"
 *     description: "Selon le type de catway et les dates choisies, ont exporte la liste des catways afin de mettre à jour le formulaire de réservation."
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
router.get('/', async (req, res) => {
    console.log("Requête reçue avec paramètres :", req.query);
    try {
      const catwayType = req.query.catwayType;
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      if (!catwayType || !startDate || !endDate) {
        return res.status(400).json({ error: 'Paramètres manquants' });
      }

      const getAvailableCatways = async (catwayType, startDate, endDate) => {
        
         // Récupère les catways du type spécifié
         const catways = await Catway.find({ catwayType });

         // Récupère les réservations sur la période demandée
         const reservations = await Reservation.find({
             startDate: { $lt: new Date(endDate) },  // Réservations avant la fin de la période
             endDate: { $gt: new Date(startDate) }   // Réservations après le début de la période
         });

         // Filtrage des catways disponibles
         return catways.filter(catway => {
             // Vérifie si ce catway est réservé pendant la période demandée
             const isReserved = reservations.some(reservation => reservation.catwayNumber === catway.catwayNumber);
             return !isReserved;  // Si ce catway est non réservé, il est disponible
         }).map(catway => catway.catwayNumber);  // Retourne uniquement les numéros des catways disponibles
     };
  
      const availableCatways = await getAvailableCatways(catwayType, new Date(startDate), new Date(endDate));
      console.log(availableCatways);
      res.json(availableCatways);
    } catch (error) {
      console.error('Erreur lors de la récupération des catways disponibles :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

module.exports = router;  