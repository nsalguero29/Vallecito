var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var funciones = require('../funciones');

var {Arreglo, Bicicleta, Cliente, Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor, ProductoVenta, Arreglo, Venta} = require('../../db/main');

var { attributesArreglo, attributesBicicleta, attributesMarca, attributesProducto, attributesProveedor, attributesVenta } = require('../attributes.json');

const estadosCompleto = ['creado', 'pagado', 'anulado'];

/* VENTAS */
/* POST NUEVO VENTAS */
router.post('/nuevo', async function(req, res, next) {
  const attributesVenta = req.body;
  const {arreglos, productos, clienteId} = attributesVenta;
  funciones.buscarClienteId(clienteId)
  .then(async (cliente)=>{
    funciones.buscarArreglosIds(arreglos)
    .then(async (arreglosLista)=>{
      if(arreglosLista.length === arreglos.length){  
        funciones.buscarProductosIds(productos)
        .then(async (productosLista)=>{ 
          if(productosLista.length === productos.length){
            Venta.create({
              ...attributesVenta,
              clienteId
            })
            .then((nuevaVenta) => {
              if(arreglosLista.length != 0){
                arreglosLista.forEach(arreg => {
                  Arreglo.update({ventaId : nuevaVenta.id}, {where : {id : arreg.id}});
                });
              }
              if(productosLista.length != 0){
                nuevaVenta.addProducto(productos);
                nuevaVenta.save();

              }
              Venta.findOne({
                attributes: attributesVenta,
                include:[{
                    model: Cliente
                },
                {
                  model: Arreglo,
                  include: [{ 
                      model: Producto
                    },
                    { 
                      model: Bicicleta
                    }]
                },
                {
                  model: Producto
                }],
                where:{ 
                    id: nuevaVenta.id,
                    estado: {[Op.or]: estadosFiltrados? [estadosFiltrados] : estadosCompleto}
                }
              })
              .then(()=>{ res.json({ status:'ok', nuevaVenta }); })
              .catch((error) => { console.log(error); res.json({status:'error', error}) });
            })
          }else{
            res.json({status:'error', error: "Algun Producto no encontrado"});
          }
        })
        .catch((error) => {
          console.log(error);
          res.json({status:'error', error})
        })
      }else{
        res.json({status:'error', error: "Algun Arreglo no encontrado"});
      }
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
})

/* GET LISTADO ARREGLOS */
router.get("/listar", function(req, res, next){
  const {estadosFiltrados} = req.body;
  Venta.findAll({
    attributes: attributesVenta,
    include:[{
        model: Cliente
    },
    {
      model: Arreglo,
      include: [{ 
          model: Producto
        },
        { 
          model: Bicicleta
        }]
    },
    {
      model: Producto
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
