var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var { Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor} = require('../../db/main');

var { attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

/* PRODUCTOS */
/* POST NUEVO PRODUCTO */
router.post('/nuevo', function(req, res, next) {
  const attributesProducto = req.body;
  const {marcaId, proveedorId} = req.body;  
  Proveedor.findOne({
    where: {id:proveedorId}
  })
  .then(async (proveedor)=>{
    if(proveedor !== null){
      if(marcaId !== undefined){
        Marca.findOne({
          where: {id:marcaId}
        })
        .then(async (marca)=>{
          if(marca !== null){
            Producto.create(attributesProducto)
            .then(async(producto)=>{
              ProductoProveedor.create({productoId: producto.id, proveedorId: proveedor.id})
              .then(async()=>{
                ProductoMarca.create({productoId: producto.id, marcaId: marca.id})
                .then(async()=>{
                  res.json({
                    status:'ok',
                    producto
                  });                  
                })
                .catch((error) => {
                  console.log(error);
                  res.json({status:'error', error})
                });
              })
              .catch((error) => {
                console.log(error);
                res.json({status:'error', error})
              });              
            })
            .catch((error) => {
              console.log(error);
              res.json({status:'error', error})
            });
          }
          else{
            res.json({status:'error', message:'Marca no encontrada'})
          }
        })
        .catch((error) => {
          console.log(error);
          res.json({status:'error', error})
        });
      }else{
        Producto.create(attributesProducto)
        .then(async(producto)=>{
          ProductoProveedor.create({productoId: producto.id, proveedorId: proveedor.id})
          .then(async()=>{
            res.json({
              status:'ok',
              producto
            });
          })
          .catch((error) => {
            console.log(error);
            res.json({status:'error', error})
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({status:'error', error})
        });
      }
    }else{
      res.json({status:'error', message:'Proveedor no encontrado'})
    }
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  });
})

/* GET LISTADO PRODUCTOS */
router.get("/listar", function(req, res, next){
  Producto.findAll({
    attributes: attributesProducto,
    include:[{
        model: Marca,
        through: { attributesMarca },
    },
    {
      model: Proveedor,
      through: { attributesProveedor },
      as: 'proveedores' 
    }
  ]
  })
  .then((productos)=>{
    res.json({
      status:'ok',
      productos
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UN PRODUCTO */
router.put('/actualiza', function(req, res, next) {
  const {id} = req.query;
  const attributesProducto = req.body;
  const {marcaId, proveedorId} = req.body; //FALTA ACTUALIZAR MARCA O PROVEEDOR DEL X PRODUCTO
  Producto.update(
    attributesProducto,
    { where: {id} }
  )
  .then((producto)=>{
    res.json({
      status:'ok',
      producto
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ELIMINA UN PRODUCTO */
router.delete('/elimina', function(req, res, next) {
  const {id} = req.query;
  Producto.destroy({ where: {id} })
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

/* BUSCAR PRODUCTOS POR NOMBRE(PRODUCTO) */
router.get('/filtrar', function(req, res, next){
  const {producto} = req.query;
  Producto.findAll({
    attributes: attributesProducto,
    include:[{
        model: Marca,
        through: { attributesMarca },
    },
    {
      model: Proveedor,
      through: { attributesProveedor },
      as: 'proveedores' 
    }],
    where:{ 
      producto: { 
        [Op.like]: '%' + producto + '%'
      }
    }
  })
  .then((productos)=>{
    res.json({
      status:'ok',
      productos
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
