var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var funciones = require('../funciones');

var { Producto} = require('../../db/main');

var {attributesProducto} = require('../attributes.json');

/* PRODUCTOS */
/* POST NUEVO PRODUCTO */
router.post('/', async function(req, res, next) {
  const attributesProducto = req.body;
  const {marcaId, proveedorId} = attributesProducto;
  funciones.buscarProveedorId(proveedorId)
  .then(()=>{
    funciones.buscarMarcaId(marcaId)
    .then(async ()=>{      
      try {
        const producto = await Producto.create(attributesProducto);
        funciones.buscarFullProductoId(producto.id)
        .then((producto)=>{res.json({status:'ok', producto});})
        .catch((error) =>{ console.log(error); res.json({status:'error', error}); });            
      } catch (error) {
        console.log(error); res.json({status:'error', error});
      }
    })
    .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
  })
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
})

router.get('/listar', function(req, res, next){
  Producto.findAll({
    attributes: ["id", "producto"],
  })
  .then((productos)=>{
    res.json({status:'ok', productos});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO PRODUCTOS */
router.get("/buscar", function(req, res, next){
  const { limit, offset, busqueda} = req.query;
  Producto.count({
    where:{
      producto: {[Op.iLike]: busqueda + '%' 

      }}
  })
  .then((total)=>{
    Producto.findAll({
      attributes: attributesProducto,
      include: {all: true},
      where:{producto: {[Op.iLike]: busqueda + '%' }},
      offset,
      limit
    })
    .then((productos)=>{
      res.json({
        status:'ok',
        productos,
        total
      });
    })
    .catch((error) => { console.log(error); res.json({status:'error', error }) });
  })
  .catch((error) => { console.log(error); res.json({status:'error', error}) });
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
              await producto.setProveedores(proveedores);
              await producto.setMarcas(marcas);
              producto.save();
              funciones.buscarFullProductoId (producto.id)
              .then((producto)=>{res.json({status:'ok', producto});})
              .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
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
  funciones.buscarFullProductoNombre(producto)
  .then((productos)=>{
      res.json({status:'ok', productos});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;