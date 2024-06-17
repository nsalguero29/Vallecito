var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var {Arreglo, Bicicleta, Cliente, Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor, ProductoVenta, Arreglo, Venta} = require('../../db/main');

var { attributesArreglo, attributesBicicleta, attributesMarca, attributesProducto, attributesProveedor, attributesVenta } = require('../attributes.json');

const estadosCompleto = ["creado", "esperando", "reparando", "finalizado", "anulado"];

/* VENTAS */
/* POST NUEVO VENTAS */
router.post('/nuevo', function(req, res, next) {
  const attributesVenta = req.body;
  const {arreglos, productos, documento} = req.body;
  buscarCliente(documento)
  .then(async (cliente)=>{
    buscarArreglos(arreglos)
    .then(async (arreglosLista)=>{
      buscarProductos(productos)
      .then(async (productosLista)=>{
        
        Venta.create({
          ...attributesVenta,
          clienteId : cliente.id
        })
        .then((nuevaVenta) => {
          if(arreglosLista.length != 0){
            arreglosLista.forEach(arreg => {
              Arreglo.update({ventaId : nuevaVenta.id}, {where : {id : arreg.id}});
            });
          }
          if(productosLista.length != 0){
            productosLista.forEach(prod => {
              ProductoVenta.create({ventaId : nuevaVenta.id, productoId : prod.id});
            });
          }
          Venta.findOne(
            {all: true},
            {where : { id : nuevaVenta.id }}
          ).then((venta)=>{
            res.json({
              status:'ok',
              venta
            }); 
          })
          .catch((error) => {
            console.log(error);
            res.json({status:'error', message:error})
          });
        })
      })
      .catch((error) =>{ console.log(error); reject(error) });
    })
    .catch((error) =>{ console.log(error); reject(error) });
  })
  .catch((error) =>{ console.log(error); reject(error) });
})

const buscarCliente = function(documento){
  return new Promise((resolve, reject) => {
    Cliente.findOne({where : { documento }})
    .then((cliente) => {
      console.log({cliente});
      if(cliente !== null) 
        resolve(cliente);
      else
        reject("Cliente no encontrado");
    })
    .catch((error) =>{ console.log(error); reject(error) });
  })
}

const buscarArreglos = function(arreglos) {
  return new Promise((resolve, reject) => {
    Arreglo.findAll({
      where: { id : { [Op.in] : arreglos} }
    })
    .then((arreglosLista)=>{resolve (arreglosLista);})
    .catch((error) => {console.log(error); reject(error) });
  })
}

const buscarProductos = function(productos) {
  return new Promise((resolve, reject) => {
    Producto.findAll({
      where: { id : { [Op.in] : productos} }
    })
    .then((productosLista)=>{resolve (productosLista);})
    .catch((error) => {console.log(error); reject(error) });
  })
}

/* GET LISTADO ARREGLOS */
router.get("/listar", function(req, res, next){
  const {estadosFiltrados} = req.body;
  Arreglo.findAll({
    attributes: attributesArreglo,
    include:[{
        model: Bicicleta,
        include: { 
          model: Cliente 
        }
    }],
    where:{ 
        estado: {[Op.or]: estadosFiltrados? [estadosFiltrados] : estadosCompleto}
    }
  })
  .then((arreglos)=>{
    res.json({
      status:'ok',
      arreglos
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* BUSCAR ARREGLOS POR ID DE BICICLETA Y ESTADO*/
router.get('/buscarBici', function(req, res, next){
  const {bicicletaId} = req.query;
  const {estadosFiltrados} = req.body;
  Arreglo.findAll({
    include: { 
      model: Bicicleta,
      include: { 
        model: Cliente 
      }
    },
    where:{ 
      bicicletaId,
      estado: {[Op.or]: [estadosFiltrados]}
    }
  })
  .then((arreglosBicicleta)=>{
    res.json({
      status:'ok',
      arreglosBicicleta
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UN ARREGLOS */
router.put('/actualizar', function(req, res, next) {
  const {id} = req.query;
  const attributesArreglo = req.body;  
  Arreglo.update(
    attributesArreglo,
    { where: {id} }
  )
  .then((arreglo)=>{
    res.json({
      status:'ok',
      arreglo
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
