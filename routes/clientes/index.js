var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Cliente, Bicicleta, Arreglo, Venta } = require('../../db/main');
var funciones = require('../funciones');

var { attributesCliente, attributesBicicleta } = require('../attributes.json');
const { where } = require('sequelize');

/* POST NUEVO CLIENTE */
router.post('/nuevo', function(req, res, next) {
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
router.get("/listar", function(req, res, next){
  const { limit, offset, busqueda} = req.query;
  Cliente.findAndCountAll({
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
    where:{documento: {[Op.like]: busqueda + '%' }},
    offset,
    limit
  })
  .then((clientes)=>{
    res.json({
      status:'ok',
      clientes: clientes.rows,
      total: clientes.count
    });
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

/* BUSCAR CLIENTES POR DOCUMENTO */
router.get('/buscar', function(req, res, next){
  const {documento} = req.query;
  funciones.buscarClientesDocumento(documento)
  .then((clientes)=>{
    res.json({
      status:'ok',
      clientes
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
