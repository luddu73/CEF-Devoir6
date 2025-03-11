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
    components: {
        securitySchemes: {
            bearerAuth: { // Définition du système d'authentification
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
            }
        }
    },
    security: [{ bearerAuth: [] }], // Appliquer l’auth sur toutes les routes
    servers: [
        {
            url: "http://localhost:3000",
            description: "Serveur de développement"
        },
        {
            url: "https://cef-devoir6.vercel.app/",
            description: "Serveur de production"
        }
    ]
  },
  apis: ["./routes/*.js", "./middlewares/*.js","./models/*.js","./services/*.js"]
};

const swaggerUiOptions = {
    swaggerOptions: {
      docExpansion: "none", // Réduit toutes les routes par défaut
      supportedSubmitMethods: process.env.NODE_ENV === "development" ? ['get', 'post', 'put', 'delete'] : [], // N'active les tests qu'en mode développement
    }
  };

// Générer la doc Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs, swaggerUiOptions };