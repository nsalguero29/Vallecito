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
    attributes: ["id", "tipo"],    
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
/*router.get("/buscar", function(req, res, next){
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
});*/

/* ACTUALIZAR UNA MARCA */
/*router.put('/actualizar', function(req, res, next) {
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
});*/

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
