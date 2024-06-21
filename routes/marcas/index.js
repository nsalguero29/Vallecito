var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Marca, Producto} = require('../../db/main');

var { attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

/* MARCAS */
/* POST NUEVA MARCA */
router.post('/nueva', function(req, res, next) {
  const attributesMarca = req.body;
  Marca.create(attributesMarca)
  .then((marca)=>{
    res.json({
      status:'ok',
      marca
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO MARCAS CON PRODUCTOS ASOCIADOS */
router.get("/listar", function(req, res, next){
  Marca.findAll({
    attributes: attributesMarca,
    include:[{
        model: Producto,
        through: { attributesProducto },
    }]
  })
  .then((marcas)=>{
    res.json({
      status:'ok',
      marcas
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UNA MARCA */
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesMarca = req.body;
  Marca.update(
    attributesMarca,
    { where: {id} }
  )
  .then((marca)=>{
    res.json({
      status:'ok',
      marca
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UNA MARCA */
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  Marca.destroy({ where: {id} })
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

/* BUSCAR UNA MARCA POR NOMBRE(MARCA) */
router.get('/buscar', function(req, res, next){
  const {marca} = req.query;
  Marca.findAll({
    attributes: attributesMarca,
    include:[{
      model: Producto,
      attributes: attributesProducto
    }],
    where:{ 
      marca: { 
        [Op.like]: '%' + marca + '%'
      }
    }
  })
  .then((marcas)=>{
    res.json({
      status:'ok',
      marcas
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
