/**
 * Application  pour l'API du port de plaisance.
 * 
 * Ce fichier configure l'application Express avec la gestion des sessions, la sécurité CORS,
 * la gestion des erreurs, la documentation Swagger, et les routes principales.
 *
 * @module app
 */

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { swaggerUi, swaggerDocs, swaggerUiOptions } = require("./swaggerConfig");
var cors = require('cors');
const session = require('express-session'); 
const methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catwaysRouter = require('./routes/catways');
var reservationsRouter = require('./routes/reservations');
var dashboardRouter = require('./routes/dashboard');
var availableRouter = require('./routes/available');

// Initialisation de la connexion à la base de donnée
var mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

/**
 * Création de l'application Express.
 * 
 * @type {express.Application}
 */
var app = express();
console.log("🚀 Démarrage de l'application...");

// Middleware de configuration
app.use(cookieParser());


/**
 * Configuration de la gestion des sessions et CORS en fonction de l'environnement.
 * 
 * @function
 */
if (process.env.NODE_ENV !== "production") {
  console.log("🌐 CORS configuré en mode développement");
  const corsOptions = {
    credentials: true, // Autorise l'envoi de cookies/token en développement
  };
  app.use(cors(corsOptions));
    app.use(session({
      secret: 'TESTKEY',
      resave: false,
      saveUninitialized: true,
      cookie: { 
        secure: false, // En développement, on peut mettre secure: false (en production, il faut le mettre à true si on utilise HTTPS)
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1h
      }      
    }));
} else {
  console.log("🌐 CORS configuré en mode production");
  const corsOptions = {
    origin: "https://cef-devoir6.vercel.app/", // Permet uniquement ce frontend en production
    methods: ["GET", "POST", "PUT", "DELETE"], // Liste des méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Autorise l'envoi de cookies/token en production
  };
  app.use(cors(corsOptions));
  app.use(session({
    secret: 'XJSOHNGFS5*5',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: true, // En développement, on peut mettre secure: false (en production, il faut le mettre à true si on utilise HTTPS)
      httpOnly: true,
      maxAge: 60 * 60 * 1000 // 1h
    }
  }));
}

/**
 * Configuration du moteur de vue EJS.
 * 
 * @type {string}
 */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
console.log("🖥 Moteur de vue configuré : EJS");

/**
 * Middleware pour ajouter la session aux vues.
 * 
 * @function
 */
app.use((req, res, next) => {
  res.locals.session = req.session; // Rendre la session accessible dans toutes les vues
  next();
});
console.log("🔒 Session configurée avec succès");

app.set('trust proxy', 1);

process.env.TZ = process.env.TZ || "Europe/Paris";

console.log("🕒 Fuseau horaire actif :", process.env.TZ);
console.log(`🚀 Serveur démarré et écoute sur le port ${process.env.PORT}`);

/*app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);  // Log l'origin de chaque requête
  next();
});*/
/* TEST POUR VERIFICATION DE RECEPTION DES COOKIES
app.use((req, res, next) => {
  console.log('🔍 Session actuelle:', req.session);
  console.log('🍪 Cookies reçus:', req.headers.cookie);
  res.on('finish', () => {
      console.log('📩 Cookies envoyés:', res.getHeaders()['set-cookie']);
  });
  next();
});*/

app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes de l'API
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);
app.use('/available', availableRouter);

// Servir la doc Swagger sur /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

// Renvoi si ressources non trouvée
app.use(function(req, res, next) {
  res.status(404).render('error', {
    errorCode: '404',
    title: 'Page Non Trouvée',
    message: 'La page que vous cherchez n\'existe pas.'
  });
});

// Renvoi en cas d'erreur
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  const { errorCode, title, message } = req.params;
  // render the error page
  res.status(err.status || 500).render('error', {
    errorCode: `${err.status || errorCode || 500}`,
    title: `${err.message || title || "Erreur"}`,
    message: message || "Une erreur est survenue. Veuillez réessayer plus tard."
  });
});

module.exports = app;
