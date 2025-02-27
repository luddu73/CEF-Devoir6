var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { swaggerUi, swaggerDocs, swaggerUiOptions } = require("./swaggerConfig");
var cors = require('cors'); // Pour sécurisé la réception des données sur l'API

var mongodb = require('./db/mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catwaysRouter = require('./routes/catways');
var reservationsRouter = require('./routes/reservations');

mongodb.initClientDbConnection();

var app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
} else {
  // Je n'autorise que depuis mon URL d'API l'envoi de données sur celle-ci
  const corsOptions = {
    origin: "http://localhost", // Permet uniquement ce frontend en développement
    methods: ["GET", "POST", "PUT", "DELETE"], // Liste des méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // Headers autorisés
    credentials: true, // Autorise l'envoi de cookies/token en production
  };
  app.use(cors(corsOptions));
}
console.log(process.env.NODE_ENV);
/*app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);  // Log l'origin de chaque requête
  next();
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/reservations', reservationsRouter);

// Servir la doc Swagger sur /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// Si la page n'est pas trouvée, on renvoi l'erreur
app.use(function(req, res, next) {
  res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not found'})
})

module.exports = app;
