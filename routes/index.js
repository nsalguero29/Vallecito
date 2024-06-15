var express = require('express');
var router = express.Router();

var clientesRouter = require('./clientes');
var bicicletasRouter = require('./bicicletas');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/clientes', clientesRouter);
router.use('/bicicletas', bicicletasRouter);

module.exports = router;
