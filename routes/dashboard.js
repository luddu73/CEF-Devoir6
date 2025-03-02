var express = require('express');
var router = express.Router();
// Import du middleware pour privatisation
const private = require('../middlewares/private');

/* GET home page. */
router.get('/', private.checkJWT, function(req, res, next) {
  const errorMessage = "";
  const message = "";
  res.render('dashboard');
});

module.exports = router;
