
process.env.TZ = process.env.TZ || "Europe/Paris";
console.log("Fuseau horaire actif :", process.env.TZ);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { swaggerUi, swaggerDocs, swaggerUiOptions } = require("./swaggerConfig");
var cors = require('cors'); // Pour sécurisé la réception des données sur l'API
const session = require('express-session'); 

var mongodb = require('./db/mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catwaysRouter = require('./routes/catways');
var reservationsRouter = require('./routes/reservations');
var dashboardRouter = require('./routes/dashboard');

mongodb.initClientDbConnection();

var app = express();

app.use(cookieParser());

app.set('trust proxy', 1);

if (process.env.NODE_ENV !== "production") {
  const corsOptions = {
    credentials: true, // Autorise l'envoi de cookies/token en production
  };
  app.use(cors(corsOptions));
    // Middleware pour la gestion de la session
    app.use(session({
      secret: 'XJSOHNGFS5*5',  // Utilise une clé secrète pour sécuriser la session
      resave: false,                 // Ne pas sauver la session si elle n'a pas été modifiée
      saveUninitialized: true,      // Ne pas sauvegarder la session si elle n'a pas été modifiée
      cookie: { 
        secure: false, // En développement, on peut mettre secure: false (en production, il faut le mettre à true si on utilise HTTPS)
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1h
      }      
    }));
} else {
  // Je n'autorise que depuis mon URL d'API l'envoi de données sur celle-ci
  const corsOptions = {
    origin: "http://localhost", // Permet uniquement ce frontend en développement
    methods: ["GET", "POST", "PUT", "DELETE"], // Liste des méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés
    credentials: true, // Autorise l'envoi de cookies/token en production
  };
  app.use(cors(corsOptions));
  // Middleware pour la gestion de la session
  app.use(session({
    secret: 'TESTKEY',  // Utilise une clé secrète pour sécuriser la session
    resave: false,                 // Ne pas sauver la session si elle n'a pas été modifiée
    saveUninitialized: false,      // Ne pas sauvegarder la session si elle n'a pas été modifiée
    cookie: { 
      secure: true, // En développement, on peut mettre secure: false (en production, il faut le mettre à true si on utilise HTTPS)
      httpOnly: true,
      maxAge: 60 * 60 * 1000 // 1h
    }
  }));
}

console.log(process.env.NODE_ENV);
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

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  res.locals.session = req.session; // Rendre la session accessible dans toutes les vues
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);

// Servir la doc Swagger sur /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('error', {
    errorCode: '404',
    title: 'Page Non Trouvée',
    message: 'La page que vous cherchez n\'existe pas.'
  });
});

// error handler
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
