var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var funciones = require('../funciones');

var { Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor} = require('../../db/main');

var { attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

/* PRODUCTOS */
/* POST NUEVO PRODUCTO */
router.post('/', async function(req, res, next) {
  const attributesProducto = req.body;
  const {marcas, proveedores} = attributesProducto; 
  funciones.buscarProveedoresIds(proveedores)
  .then((listaProveedores)=>{
    if(listaProveedores.length !== proveedores.length){
      res.json({status:'error', "error" : "Proveedor no encontrado"});
    }else{
      funciones.buscarMarcasIds(marcas)
      .then(async (listaMarcas)=>{
        if(listaMarcas.length !== marcas.length){
          res.json({status:'error', "error" : "Marca no encontrada"});
        }else{
          try {
            const producto = await Producto.create(attributesProducto);
            await producto.addProveedor(proveedores);
            await producto.addMarca(marcas);
            res.json({status:'ok', producto});
          } catch (error) {
            console.log(error); res.json({status:'error', error});
          }
        }
      })
      .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
    }
  })
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
})

/* GET LISTADO PRODUCTOS */
router.get("/listar", function(req, res, next){
  Producto.findAll({
    attributes: attributesProducto,
    include: {all: true}
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
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesProducto = req.body;
  const {marcas, proveedores} = attributesProducto;
  funciones.buscarProductoId(id)
  .then((producto)=>{
    funciones.buscarProveedoresIds(proveedores)
    .then((listaProveedores)=>{
      if(listaProveedores.length !== proveedores.length){
        res.json({status:'error', "error" : "Proveedor no encontrado"});
      }else{
        funciones.buscarMarcasIds(marcas)
        .then(async (listaMarcas)=>{
          if(listaMarcas.length !== marcas.length){
            res.json({status:'error', "error" : "Marca no encontrada"});
          }else{
            try {
              await producto.set(attributesProducto);
              await producto.setProveedor(proveedores);
              await producto.setMarca(marcas);
              producto.save();
              res.json({status:'ok', producto});
            } catch (error) {
              console.log(error); res.json({status:'error', error});
            }
          }
        })
        .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
      }
    })
    .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
  })
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
});

/* ELIMINA UN PRODUCTO */
router.delete('/eliminar', function(req, res, next) {
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
router.get('/buscar', function(req, res, next){
  const {producto} = req.query;
  Producto.findAll({
    attributes: attributesProducto,
    include:{all: true},
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