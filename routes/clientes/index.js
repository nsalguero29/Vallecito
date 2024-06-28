var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Cliente, Bicicleta, Arreglo, Venta } = require('../../db/main');
var funciones = require('../funciones');

var { attributesCliente, attributesBicicleta } = require('../attributes.json');

/* POST NUEVO CLIENTE */
router.post('/', function(req, res, next) {
  const attributesCliente = req.body;
  Cliente.create(attributesCliente)
  .then((cliente)=>{
    res.json({
      status:'ok',
      cliente
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO CLIENTES */
router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda } = req.query;
  Cliente.count({
    where:{documento: {[Op.iLike]: busqueda + '%' }},
  })
  .then((count)=>{
    Cliente.findAll({
      attributes: attributesCliente,
      include:[{
        attributes: attributesBicicleta,
        model: Bicicleta,
        include: {
          model: Arreglo,
          as: 'arreglos'
        },
        as: 'bicicletas'
      },{
        model: Venta,
        as: 'ventas'
      }],
      where:{documento: {[Op.iLike]: busqueda + '%' }},
      offset,
      limit
    })
    .then((clientes)=>{
      res.json({
        status:'ok',
        clientes,
        total: count
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({status:'error', error})
    })
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UN CLIENTE */
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesCliente = req.body;
  Cliente.update(
    attributesCliente,
    { where: {id} }
  )
  .then((cliente)=>{
    res.json({
      status:'ok',
      cliente
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UNA CLIENTE */
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  Cliente.destroy({ where: {id} })
  .then(()=>{
    res.json({
      status:'ok'
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
