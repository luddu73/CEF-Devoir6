const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Définition des options de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API Port de Plaisance de Russell",
      version: "1.0.0",
      description: "Documentation de l'API pour gérer les réservations du port de plaisance de Russell" 
    },
  },
  apis: ["./routes/*.js", "./middlewares/*.js","./models/*.js","./services/*.js"], 
};

const swaggerUiOptions = {
    swaggerOptions: {
      docExpansion: "none", // Réduit toutes les routes par défaut
    }
  };

// Générer la doc Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs, swaggerUiOptions };