var express = require('express');
var router = express.Router();
var funciones = require('../funciones');
const { Op } = require("sequelize");

var { Cliente, Bicicleta, Arreglo, Marca, Modelo } = require('../../db/main');

var {attributesMarca, attributesModelo,
   attributesCliente, attributesBicicleta } = require('../attributes.json');

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
  Bicicleta.count({
    where:{cuadro: {[Op.iLike]: busqueda + '%' }},
  })
  .then((count) => {
    Bicicleta.findAll({
      attributes: attributesBicicleta,
      include:[{
        model: Marca,
        attributes: attributesMarca,
        as:'marca'
      },{
        model: Modelo,
        attributes: attributesModelo,
        as:'modelo'
      },{
        model: Cliente,
        attributes: attributesCliente
      },{
        model: Arreglo,
        as: 'arreglos'
      }],
      where:{cuadro: {[Op.iLike]: busqueda + '%' }},
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
