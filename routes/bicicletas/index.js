var express = require('express');
var router = express.Router();
var funciones = require('../funciones');

var { Cliente, Bicicleta, Arreglo } = require('../../db/main');

var { attributesCliente, attributesBicicleta } = require('../attributes.json');

/* POST NUEVO BICICLETA */
router.post('/', function(req, res, next) {
  const attributesBicicleta = req.body;
  const {clienteId} = attributesBicicleta;
  funciones.buscarClienteId(clienteId)
  .then(()=>{ 
    Bicicleta.create(attributesBicicleta)
    .then((bicicleta)=>{
      res.json({
        status:'ok', 
        bicicleta
      });
    })
    .catch((error) => { console.log(error); res.json({status:'error', error}) })
  })
  .catch((error) => { console.log(error); res.json({status:'error', error}) })  
});

/* GET LISTADO BICICLETA */
router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda } = req.query;
  Bicicleta.count({})
  .then((count) => {
    Bicicleta.findAll({
      attributes: attributesBicicleta,
      include:[{
        model: Cliente,
        attributes: attributesCliente
      },{
        model: Arreglo,
        as: 'arreglos'
      }],
      offset,
      limit
    })
    .then((bicicletas)=>{
      res.json({
        status:'ok',
        bicicletas,
        total: count
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({status:'error', error})
    })
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

module.exports = router;
