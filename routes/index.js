var express = require('express');
var router = express.Router();

var arreglosRouter = require('./arreglos');
var bicicletasRouter = require('./bicicletas');
var clientesRouter = require('./clientes');
var comprasRouter = require('./compras');
var marcasRouter = require('./marcas');
var modelosRouter = require('./modelos');
var productosRouter = require('./productos');
var proveedoresRouter = require('./proveedores');
var tiposProductos = require('./tiposProductos');
var ventasRouter = require('./ventas');
var usuariosRouter = require('./usuarios');
var adminRouter = require('./admin');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/usuarios', usuariosRouter);
router.use('/arreglos', arreglosRouter);
router.use('/bicicletas', bicicletasRouter);
router.use('/clientes', clientesRouter);
router.use('/compras', comprasRouter);
router.use('/modelos', modelosRouter);
router.use('/marcas', marcasRouter);
router.use('/productos', productosRouter);
router.use('/proveedores', proveedoresRouter);
router.use('/tiposProductos', tiposProductos);
router.use('/ventas', ventasRouter);
router.use('/admin', adminRouter);

module.exports = router;
