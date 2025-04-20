var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { TiposProducto, Producto} = require('../../db/main');

/* TIPOS PRODUCTOS */
/* POST NUEVO TIPO PRODUCTOS */
router.post('/', function(req, res, next) {
  const attributesTipoProducto = req.body;
  TiposProducto.create(attributesTipoProducto)
  .then((tipoProducto)=>{
    res.json({
      status:'ok',
      tipoProducto
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

router.get('/listar', function(req, res, next){
  TiposProducto.findAll({
    attributes: ["id", "tipoProducto"],    
  })
  .then((tiposProducto)=>{
    res.json({status:'ok', tiposProducto});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO MARCAS CON PRODUCTOS ASOCIADOS */
router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda } = req.query;
  TiposProducto.count({
    where:{tipoProducto: {[Op.iLike]: busqueda + '%' }},
  })
  .then((count)=>{
    TiposProducto.findAll({
      attributes: ["id", "tipoProducto"],
      where:{tipoProducto: {[Op.iLike]: busqueda + '%' }},
      offset,
      limit
    })
    .then((tiposProducto)=>{
      res.json({
        status:'ok',
        tiposProducto,
        total: count
      });
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
  const attributesTipoProducto = req.body;
  TiposProducto.update(
    attributesTipoProducto,
    { where: {id: attributesTipoProducto.id} }
  )
  .then((tipo)=>{
    res.json({
      status:'ok',
      tipo
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UN TIPO PRODUCTOS*/
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  TiposProducto.destroy({ where: {id} })
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
