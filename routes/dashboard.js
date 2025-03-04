var express = require('express');
var router = express.Router();

// Import du middleware pour privatisation
const private = require('../middlewares/private');
const Catway = require('../models/catways');
const Reservation = require('../models/reservations');

/* GET home page. */
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
    
      

    res.render('dashboard', { 
      currentPage: 'dashboard', 
      currentReservations,
      availableCatwaysCount, 
      availableLongCatways, 
      availableShortCatways,
      availabilityPercentage,
      mostReservedCatwayNumber,
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
