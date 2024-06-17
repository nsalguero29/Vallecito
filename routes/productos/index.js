var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var funciones = require('../funciones');

var { Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor} = require('../../db/main');

var { attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

/* PRODUCTOS */
/* POST NUEVO PRODUCTO */
router.post('/nuevo', function(req, res, next) {
  const attributesProducto = req.body;
  const {marcas, proveedores} = req.body; 
  Producto.create(attributesProducto)
  .then(async(producto)=>{
    actualizarProveedores(producto.id, proveedores)
    .then(()=>{
      actualizarMarcas(producto.id, marcas)
      .then(()=> res.json({ status:'ok', producto }))
      .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
    })
    .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
  })
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
})

/* GET LISTADO PRODUCTOS */
router.get("/listar", function(req, res, next){
  const {activo} = req.body;
  Producto.findAll({
    attributes: attributesProducto,
    include:[{
        model: Marca,
        through: { attributesMarca, where: { activo: activo!==undefined? activo : true } },
    },
    {
      model: Proveedor,
      through: { attributesProveedor, where: { activo: activo!==undefined? activo : true } },
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
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesProducto = req.body;
  const {marcas, proveedores} = req.body; //FALTA ACTUALIZAR MARCA O PROVEEDOR DEL X PRODUCTO
  Producto.update(
    attributesProducto,
    { where: {id} }
  )
  .then(()=>{
    actualizarProveedores(id, proveedores)
    .then(()=>{
      actualizarMarcas(id, marcas)
      .then(()=>{
        Producto.findOne({
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
          where: {id} 
        })
        .then((prodcuto) => res.json({status:'ok', prodcuto}))
        .catch((error) => res.json({status:'error', error}));
      })
      .catch((error) => res.json({status:'error', error}));
    })
    .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
  })
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
});

/* CONTROL PRODUCTOS PROVEEDORES*/
const actualizarProveedores = function(id, proveedores){
  return new Promise((resolve, reject) => {
    ProductoProveedor.findAll(
      {where: {productoId: id}}
    ).then((productoProveedores)=>{
      proveedores.forEach(element=> {
        const existe = productoProveedores.find(pp => pp.proveedorId === element);
        if(!existe){
          funciones.buscarProveedorId(element)
          .then((proveedor)=> {
            ProductoProveedor.create({productoId: id, proveedorId: proveedor.id})
          })
          .catch((error) =>{ console.log(error); reject(error) });
        }else if(existe){
          ProductoProveedor.update(
            { activo : true },
            { where : { [Op.and] : {productoId: id, proveedorId : element} }}
          );
        }
      });
      productoProveedores.forEach(element=> {
        const existe = proveedores.find(p => p === element.proveedorId);
        if(!existe){
          ProductoProveedor.update(
            { activo : false },
            { where : { id : element.id }}
          );
        }
      });
    })
    .then(()=>resolve())
    .catch((error) =>{ console.log(error); reject(error) });
  });
};

/* CONTROL PRODUCTOS MARCAS*/
const actualizarMarcas = function(id, marcas) {
  return new Promise((resolve, reject) => {
    ProductoMarca.findAll(
      {where: {productoId: id}}
    ).then((productoMarcas)=>{
      marcas.forEach(element=> {
        const existe = productoMarcas.find(pm => pm.marcaId === element);
        if(!existe){
          funciones.buscarMarcaId(element)
          .then((marca)=> ProductoMarca.create({productoId: id, marcaId: marca.id}))
          .catch((error) =>{ console.log(error); reject(error) });
        }else if(existe){
          ProductoMarca.update(
            { activo : true },
            { where : { [Op.and] : {productoId: id, marcaId : element} }}
          );
        }
      });
      productoMarcas.forEach(element=> {
        const existe = marcas.find(m => m === element.marcaId);
        if(!existe){
          ProductoMarca.update(
            { activo : false },
            { where : { id : element.id }}
          );
        }
      });      
    })
    .then(()=>resolve())
    .catch((error) =>{ console.log(error); reject(error) });
  });
};

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

/* FILTRAR PRODUCTOS POR NOMBRE(PRODUCTO) */
router.get('/filtrar', function(req, res, next){
  const {producto} = req.query;
  const {activo} = req.body;
  Producto.findAll({
    attributes: attributesProducto,
    include:[{
        model: Marca,
        through: { attributesMarca, where: { activo: activo!==undefined? activo : true }},        
    },
    {
      model: Proveedor,
      through: { attributesProveedor, where: { activo: activo!==undefined? activo : true }},
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