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

const { checkUser } = require('./middleware');

router.use('/usuarios', usuariosRouter);

/* GET home page. */
router.use('/', function(req, res, next) {
  const token = req.headers.authorization;
  checkUser(token)
  .then((resp) =>{
    next();
  })
  .catch((error) =>{
    console.error(error);
    res.status(error.status).json({status: "error", error: error.msj})
  })
});

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
