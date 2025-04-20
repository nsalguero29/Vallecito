var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Marca, Producto, Proveedor } = require('../../db/main');

var { attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

/* PROVEEDORES */
/* POST NUEVO PROVEEDOR */
router.post('/', function(req, res, next) {
  const attributesProveedor = req.body;
  Proveedor.create(attributesProveedor)
  .then((proveedor)=>{
    res.json({
      status:'ok',
      proveedor
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

router.get('/listar', function(req, res, next){
  Proveedor.findAll({
    attributes: ["id", "proveedor"],    
  })
  .then((proveedores)=>{
    res.json({status:'ok', proveedores});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO PROVEEDORES CON PRODUCTOS ASOCIADOS */
router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda } = req.query;
  Proveedor.count({
    where:{proveedor: {[Op.iLike]: busqueda + '%' }}
  })
  .then((total)=>{
    Proveedor.findAll({
      attributes: attributesProveedor,
      include:[{
          model:Producto,
          attributes: attributesProducto,
          as:'productos',
          include:{
            model:Marca,
            attributes: attributesMarca,
            as: 'marca'
          }
      }],
      where:{proveedor: {[Op.iLike]: busqueda + '%' }},
      offset,
      limit
    })
    .then((proveedores)=>{
      res.json({
        status:'ok',
        proveedores,
        total
      });
    })
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UN PROVEEDOR */
router.put('/', function(req, res, next) {
  //const {id} = req.query;
  const attributesProveedor = req.body;
  Proveedor.update(
    attributesProveedor,
    { where: {id: attributesProveedor.id} }
  )
  .then((proveedor)=>{
    res.json({
      status:'ok',
      proveedor
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UN PROVEEDOR */
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  Proveedor.destroy({ where: {id} })
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
