var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Marca, Producto} = require('../../db/main');

var { attributesMarca, attributesProducto } = require('../attributes.json');

/* MARCAS */
/* POST NUEVA MARCA */
router.post('/', function(req, res, next) {
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

router.get('/listar', function(req, res, next){
  Marca.findAll({
    attributes: ["id", "marca"],    
  })
  .then((marcas)=>{
    res.json({status:'ok', marcas});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO MARCAS CON PRODUCTOS ASOCIADOS */
router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda } = req.query;
  Marca.count({
    where:{marca: {[Op.iLike]: busqueda + '%' }},
  })
  .then((count)=>{
    Marca.findAll({
      attributes: attributesMarca,
      include:{
        model: Producto,
        attributes: attributesProducto,
        as:'productos'
      },
      where:{marca: {[Op.iLike]: busqueda + '%' }},
      offset,
      limit
    })
    .then((marcas)=>{
      res.json({
        status:'ok',
        marcas: marcas,
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

/* ACTUALIZAR UNA MARCA */
router.put('/', function(req, res, next) {
  //const {id} = req.query;
  const attributesMarca = req.body;
  Marca.update(
    attributesMarca,
    { where: {id: attributesMarca.id} }
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
        [Op.iLike]: '%' + marca + '%'
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
