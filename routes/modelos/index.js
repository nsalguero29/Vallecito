var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Modelo } = require('../../db/main');

var { attributesModelo } = require('../attributes.json');

/* Modelo */
/* POST NUEVA Modelo */
router.post('/', function(req, res, next) {
  const attributesModelo = req.body;
  Modelo.create(attributesModelo)
  .then((modelo)=>{
    res.json({
      status:'ok',
      modelo
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

router.get('/listar', function(req, res, next){
  Modelo.findAll({
    attributes: attributesModelo,    
  })
  .then((modelos)=>{
    res.json({status:'ok', modelos});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda } = req.query;
  Modelo.count({
    where:{modelo: {[Op.iLike]: busqueda + '%' }},
  })
  .then((count)=>{
    Modelo.findAll({
      attributes: attributesModelo,
      where:{modelo: {[Op.iLike]: busqueda + '%' }},
      offset,
      limit
    })
    .then((modelos)=>{
      res.json({
        status:'ok',
        modelos,
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

/* ACTUALIZAR UNA Modelo */
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesModelo = req.body;
  Modelo.update(
    attributesModelo,
    { where: {id} }
  )
  .then((modelo)=>{
    res.json({
      status:'ok',
      modelo
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UNA Modelo */
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  Modelo.destroy({ where: {id} })
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
