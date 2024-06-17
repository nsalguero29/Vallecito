var express = require('express');
var router = express.Router();

var arreglosRouter = require('./arreglos');
var bicicletasRouter = require('./bicicletas');
var clientesRouter = require('./clientes');
var marcasRouter = require('./marcas');
var productosRouter = require('./productos');
var proveedoresRouter = require('./proveedores');
var ventasRouter = require('./ventas');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/arreglos', arreglosRouter);
router.use('/bicicletas', bicicletasRouter);
router.use('/clientes', clientesRouter);
router.use('/marcas', marcasRouter);
router.use('/productos', productosRouter);
router.use('/proveedores', proveedoresRouter);
router.use('/ventas', ventasRouter);

module.exports = router;
