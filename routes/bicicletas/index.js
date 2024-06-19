var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
var funciones = require('../funciones');

var { Cliente, Bicicleta } = require('../../db/main');

var { attributesCliente, attributesBicicleta } = require('../attributes.json');

/* POST NUEVO BICICLETA */
router.post('/nueva', function(req, res, next) {
  const attributesBicicleta = req.body;
  const {clienteId} = req.body;
  funciones.buscarClienteId(clienteId)
  .then((cliente)=>{ 
    cliente.setBicicletas({
      ...attributesBicicleta,
      clienteId
      });
    cliente.save()
    .then((cliente)=>{ res.json({status:'ok', cliente}); })
    .catch((error) => { console.log(error); res.json({status:'error', error}) })  
  })
  .catch((error) => { console.log(error); res.json({status:'error', error}) })  
});

/* GET LISTADO BICICLETA */
router.get("/listar", function(req, res, next){
  Bicicleta.findAll({
    attributes: attributesBicicleta,
    include:[{
      model: Cliente,
      attributes: attributesCliente
    }]
  })
  .then((bicicletas)=>{
    res.json({
      status:'ok',
      bicicletas
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UNA BICICLETA */
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesBicicleta = req.body;
  Bicicleta.update(
    attributesBicicleta,
    { where: {id} }
  )
  .then((bicicleta)=>{
    res.json({
      status:'ok',
      bicicleta
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UNA BICICLETA */
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  Bicicleta.destroy({ where: {id} })
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

/* BUSCAR BICICLETAS POR CLIENTE */
router.get('/buscarCliente', function(req, res, next){
  const {clienteId} = req.query;
  Bicicleta.findAll({
    attributes: attributesBicicleta,
    include:[{
      model: Cliente,
      attributes: attributesCliente
    }],
    where:{ clienteId }
  })
  .then((bicicletas)=>{
    res.json({
      status:'ok',
      bicicletas
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
