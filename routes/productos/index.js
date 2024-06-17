var express = require('express');
var router = express.Router();
const { Op, where } = require("sequelize");
var { Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor} = require('../../db/main');

var { attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

/* PRODUCTOS */
/* POST NUEVO PRODUCTO */
router.post('/nuevo', function(req, res, next) {
  const attributesProducto = req.body;
  const {marcaId, proveedorId} = req.body;  
  Producto.create(attributesProducto)
  .then(async(producto)=>{
    nuevoProductoProveedor(producto.id, proveedorId)
    .then(()=>{
      nuevoProductoMarca(producto.id, marcaId)
      .then(()=> res.json({ status:'ok', producto }))
      .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
    })
    .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
  })
  .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
})

const nuevoProductoProveedor = function(productoId, proveedorId){
  return new Promise((resolve, reject) => {
    Proveedor.findOne({
      where: {id : proveedorId}
    })
    .then((proveedor)=>{
      ProductoProveedor.create({productoId, proveedorId})
      .then(()=>{
        resolve(proveedor);
      })
      .catch((error) =>{ console.log(error); reject(error) });
    })
    .catch((error) =>{ console.log(error); reject(error) });
  })
};

const nuevoProductoMarca = function(productoId, marcaId){
  return new Promise((resolve, reject) => {
    Marca.findOne({
      where: {id : marcaId}
    })
    .then((marca)=>{
      ProductoMarca.create({productoId, marcaId})
      .then(()=>{
        resolve(marca);
      })
      .catch((error) =>{ console.log(error); reject(error) });
    })
    .catch((error) =>{ console.log(error); reject(error) });
  })
};

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

const actualizarProveedores = function(id, proveedores){
  return new Promise((resolve, reject) => {
    ProductoProveedor.findAll(
      {where: {productoId: id}}
    ).then((productoProveedores)=>{
      proveedores.forEach(element=> {
        const existe = productoProveedores.find(proov => proov.proveedorId === element);
        if(!existe){
          Proveedor.findOne({ where : { id : element }})
          .then((proveedor)=> ProductoProveedor.create({productoId: id, proveedorId: proveedor.id}))
          .catch((error) =>{ console.log(error); reject(error) });
        }else if(existe){
          ProductoProveedor.update(
            { activo : true },
            { where : { [Op.and] : {productoId: id, proveedorId : element} }}
          );
        }
      });
      productoProveedores.forEach(element=> {
        const existe = proveedores.find(proov => proov === element.proveedorId);
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

const actualizarMarcas = function(id, marcas) {
  return new Promise((resolve, reject) => {
    ProductoMarca.findAll(
      {where: {productoId: id}}
    ).then((productoMarcas)=>{
      marcas.forEach(element=> {
        const existe = productoMarcas.find(proov => proov.marcaId === element);
        if(!existe){
          Marca.findOne({ where : { id : element }})
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
        const existe = marcas.find(proov => proov === element.marcaId);
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

/* BUSCAR PRODUCTOS POR NOMBRE(PRODUCTO) */
router.get('/buscar', function(req, res, next){
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