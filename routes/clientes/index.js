var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Cliente, Bicicleta } = require('../../db/main');

var { attributesCliente, attributesBicicleta } = require('../attributes.json');

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
  Cliente.findAll({
    attributes: attributesCliente,
    include:[{
      model: Bicicleta,
      attributes: attributesBicicleta
    }]
  })
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

/* BUSCAR UN POR DOCUMENTO */
router.get('/buscar', function(req, res, next){
  const {documento} = req.query;
  Cliente.findAll({
    attributes: attributesCliente,
    include:[{
      model: Bicicleta,
      attributes: attributesBicicleta
    }],
    where:{ 
      documento: { 
        [Op.like]: documento + '%'
      }
    }
  })
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
