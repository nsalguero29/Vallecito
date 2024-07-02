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
  const {marcaId, proveedorId, tiposProductoIds} = attributesProducto;
  funciones.buscarProveedorId(proveedorId)
  .then(()=>{
    funciones.buscarMarcaId(marcaId)
    .then(()=>{
      funciones.buscarTiposProductoIds(tiposProductoIds)
      .then(async ()=>{      
        try {
          const producto = await Producto.create(attributesProducto);
          await producto.setTiposProducto(tiposProductoIds);          
          producto.save();
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
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
})

/* GET LISTADO PRODUCTOS */
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

/* GET BUSQUEDA PRODUCTOS */
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
      console.log(productos)
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
  const {marcaId, proveedorId, tiposProductoIds} = attributesProducto;
  funciones.buscarProductoId(id)
  .then((producto)=>{
    funciones.buscarProveedorId(proveedorId)
    .then(()=>{      
        funciones.buscarMarcaId(marcaId)
        .then(()=>{ 
          funciones.buscarTiposProductoIds(tiposProductoIds)
          .then(async ()=>{          
              try {
                await producto.set(attributesProducto);
                await producto.setTiposProducto(tiposProductoIds);
                producto.save();
                funciones.buscarFullProductoId (producto.id)
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

module.exports = router;