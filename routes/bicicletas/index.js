var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');

var { Cliente, Bicicleta } = require('../../db/main');

var { attributesCliente, attributesBicicleta } = require('../attributes.json');

/* POST NUEVO BICICLETA */
router.post('/nueva', function(req, res, next) {
  const attributesBicicleta = req.body;
  const {clienteId} = req.body;
  Cliente.findOne({
    where:{id : clienteId}
  })
  .then((cliente) => {
    if(cliente != null){
      Bicicleta.create({
        ...attributesBicicleta,
        clienteId
       })
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
    }else{
      res.json({status:'error', message:'El Cliente no existe'})  
    }
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })  
});

/* GET LISTADO BICICLETA */
router.get("/listar", function(req, res, next){
  Bicicleta.findAll({
    attributesBicicleta,
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
router.put('/actualiza', function(req, res, next) {
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
router.delete('/elimina', function(req, res, next) {
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
router.get('/filtrar', function(req, res, next){
  const {clienteId} = req.query;
  Bicicleta.findAll({
    attributesBicicleta,
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
