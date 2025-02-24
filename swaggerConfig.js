const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Définition des options de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API Port de Plaisance",
      version: "1.0.0",
      description: "Documentation de l'API pour gérer les réservations d'un port de plaisance",
    },
  },
  apis: ["./routes/*.js", "./middlewares/*.js","./models/*.js","./services/*.js"], 
};

// Générer la doc Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };