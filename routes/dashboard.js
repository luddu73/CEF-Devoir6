/**
 * @module dashboard
 * @description Gère la page d'accueil du tableau de bord, affichant les informations des catways et des réservations en cours.
 */
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Gestion du tableau de bord avec des informations sur les réservations et les catways.
 */

var express = require('express');
var router = express.Router();

// Import du middleware pour privatisation
const private = require('../middlewares/private');
const Catway = require('../models/catways');
const Reservation = require('../models/reservations');

/**
 * @function
 * @name GET /
 * @description Affiche la page d'accueil du tableau de bord avec les informations sur les réservations et les catways disponibles.
 * @middleware private.checkJWT - Vérifie le JWT pour l'accès privé
 * @async
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {void} - Rend la vue 'dashboard' avec les informations demandées
 * @throws {Error} - Si une erreur se produit lors de la récupération des données
 */
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - "Dashboard"
 *     summary: "Affiche le tableau de bord"
 *     description: "Cette route permet d'afficher la page d'accueil du tableau de bord avec des informations sur les catways, réservations en cours et taux de disponibilité."
 *     responses:
 *       200:
 *         description: "Page d'accueil du tableau de bord affichée avec succès."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html>...</html>"
 *       401:
 *         description: "Accès non autorisé, JWT manquant ou invalide"
 *       500:
 *         description: "Erreur interne du serveur"
 */
router.get('/', private.checkJWT, async function(req, res, next) {  
  try {
    const currentDate = new Date();

    // Récupérer les réservations en cours
    const currentReservations = await Reservation.find({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
      }).sort({ endDate: 1 });

    // Récupérer les catways réservés à la date d'aujourd'hui
    const currentReservedCatways = await Reservation.distinct("catwayNumber", {
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });

    // Récupérer les catways disponibles (donc non trouvés dans la fonction au dessus)
    const availableCatways = await Catway.find({ catwayNumber: { $nin: currentReservedCatways } });
    // Filtrer les catways longs et courts disponibles
    const availableLongCatways = availableCatways.filter(catway => catway.catwayType === 'long').length;
    const availableShortCatways = availableCatways.filter(catway => catway.catwayType === 'short').length;

    // Récupérer le nombre total de catways existants
    const totalCatways = await Catway.countDocuments();

    // Calcul du pourcentage de disponibilité actuel
    const availableCatwaysCount = availableCatways.length;
    const availabilityPercentage = totalCatways > 0 ? ((availableCatwaysCount / totalCatways) * 100).toFixed(0) : 0;

     // Récupérer le catway le plus souvent réservé
    const mostReservedCatway = await Reservation.aggregate([
        { $group: { _id: "$catwayNumber", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    const mostReservedCatwayNumber = mostReservedCatway.length > 0 ? mostReservedCatway[0]._id : "Aucun";


    // Calcul du nombre de jours totaux des réservations afin de calculer la durée moyenne de réservation
    const reservationsList = await Reservation.find(); // Liste des réservations
    const totalDays = reservationsList.reduce((acc, reservationInfos) => {
        const duration =
          (new Date(reservationInfos.endDate) - new Date(reservationInfos.startDate)) /
          (1000 * 60 * 60 * 24); // Conversion millisecondes > jours
        return acc + duration;   // Adition des différentes réservations
      }, 0);
  
      const avgDuration = Math.round(totalDays / reservationsList.length);

       // Créer une date un an plus tôt pour analyse de la fréquentation sur la période
       const yearDate = new Date(currentDate);
       yearDate.setFullYear(currentDate.getFullYear() - 1);
       // Calcul du taux moyen de fréquentation sur l'année en cours
        const reservationsYearList = await Reservation.find({
            $or: [
                { startDate: { $lte: currentDate }, endDate: { $gte: yearDate } }, // Réservations qui chevauche la période choisie
                { startDate: { $gte: yearDate, $lte: currentDate } }, // Réservations commencées dans l'année
                { endDate: { $gte: yearDate, $lte: currentDate } } // Réservations terminées dans l'année
            ]
        });
        
        // Calcul du nombre total de jours réservés pour ces réservations
        const totalReservedDays = reservationsYearList.reduce((acc, reservation) => {
            const duration =
            (new Date(reservation.endDate) - new Date(reservation.startDate)) /
            (1000 * 60 * 60 * 24); // Conversion millisecondes > jours
            return acc + duration;
        }, 0);
        // Nombre de jours totaux disponibles sur l'année (nombre de catway * 365 jours)
        const totalAvailableDays = totalCatways * 365;
        // Calcul du taux de fréquentation
        const occupationRate = Math.round((totalReservedDays / totalAvailableDays) * 100);

      // Récupération du nombre total de réservations
      const totalReservations = await Reservation.countDocuments({});
    
      
    const errorCode = req.query.error;
    const successCode = req.query.success;
    let errorMessage = null;
    let message = null;

    switch (successCode) {
        case "DEL":
            message = "Réservation supprimée avec succès.";
            break;
    }

    switch (errorCode) {
        case "DEL_1":
            errorMessage = "La réservation n'a pas pu être supprimée.";
            break;
        default:
            errorMessage = errorCode;
            break;
    }

    res.render('dashboard', { 
      currentPage: 'dashboard', 
      currentReservations,
      availableCatwaysCount, 
      availableLongCatways, 
      availableShortCatways,
      availabilityPercentage,
      mostReservedCatwayNumber,
      errorMessage: errorMessage,
      message: message,
      avgDuration,
      totalReservations,
      occupationRate
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des catways disponibles :", error);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
