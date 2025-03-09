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
 *       - name: "catwayType"
 *         in: "query"
 *         required: true
 *         description: "Le type de catway recherché (long ou court)."
 *         schema:
 *           type: string
 *           enum: [long, short]
 *       - name: "startDate"
 *         in: "query"
 *         required: true
 *         description: "Date de début de la réservation."
 *         schema:
 *           type: string
 *           format: date
 *       - name: "endDate"
 *         in: "query"
 *         required: true
 *         description: "Date de fin de la réservation."
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: "Liste des catways disponibles récupérée avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *                 description: "Numéro du catway disponible"
 *               example: [12, 15, 20]
 *       400:
 *         description: "Paramètres manquants ou invalides (catwayType, startDate, endDate)."
 *       401:
 *         description: "Token de sécurité invalide ou inexistant."
 *       404:
 *         description: "Aucun catway disponible trouvé."
 *       500:
 *         description: "Erreur serveur interne lors de la récupération des catways."
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
      res.json(availableCatways);
    } catch (error) {
      console.error('Erreur lors de la récupération des catways disponibles :', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });

module.exports = router;  