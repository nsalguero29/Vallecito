var express = require('express');
var router = express.Router();
var funciones = require('../funciones');
var {Venta} = require('../../db/main');

/* VENTAS */
/* POST NUEVO VENTAS */
router.post('/', async function(req, res, next) {
  const attributesVenta = req.body;
  const {arreglos, productos, clienteId} = attributesVenta;
  funciones.buscarClienteId(clienteId)
  .then(async ()=>{
    funciones.buscarArreglosIds(arreglos)
    .then(async (arreglosLista)=>{
      if(arreglosLista.length === arreglos.length){  
        funciones.buscarProductosIds(productos)
        .then(async (productosLista)=>{ 
          if(productosLista.length === productos.length){
            const venta = await Venta.create({...attributesVenta,clienteId});
            if(arreglosLista.length != 0){
              await venta.setArreglos(arreglos);                
            }
            if(productosLista.length != 0){
              await venta.setProductos(productos);
            }
            funciones.buscarFullVentaId(venta.id)
            .then((venta)=>{ res.json({ status:'ok', venta }); })
            .catch((error) => { console.log(error); res.json({status:'error', error}) });
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

/* GET LISTADO VENTAS */
router.get("/listar", function(req, res, next){
  const {tiposPagoFiltrados, facturadas} = req.body;
  funciones.listarFullVentas(tiposPagoFiltrados, facturadas)
  .then((ventas)=>{ res.json({ status:'ok', ventas }); })
  .catch((error) => { console.log(error); res.json({status:'error', error}) });
});

/* ACTUALIZAR UNA VENTA */
router.put('/actualizar', async function(req, res, next) {
  const {id} = req.query;
  const attributesVenta = req.body;
  const {arreglos, productos, clienteId} = attributesVenta; 
  funciones.buscarClienteId(clienteId)
  .then(async ()=>{
    funciones.buscarArreglosIds(arreglos)
    .then(async (arreglosLista)=>{
      if(arreglosLista.length === arreglos.length){  
        funciones.buscarProductosIds(productos)
        .then(async (productosLista)=>{ 
          if(productosLista.length === productos.length){
            funciones.buscarVentaId(id)
            .then(async (venta)=>{
              try {
                await venta.set({...attributesVenta,clienteId});
                if(arreglosLista.length != 0){
                  await venta.setArreglos(arreglos);
                }
                if(productosLista.length != 0){
                  await venta.setProductos(productos);
                }
                venta.save();
                funciones.buscarFullVentaId(venta.id)
                .then((venta)=>{ res.json({ status:'ok', venta }); })
                .catch((error) => { console.log(error); res.json({status:'error', error}) });
              } catch (error) {
                console.log(error); res.json({status:'error', error});
              }
            })
            .catch((error) => { console.log(error); res.json({status:'error', error}) });
          }else{
            res.json({status:'error', error: "Producto no encontrado"});
          }
        })
        .catch((error) => {console.log(error);res.json({status:'error', error});});
      }else{
        res.json({status:'error', error: "Arreglo no encontrado"});
      }
    })
    .catch((error) => {console.log(error);res.json({status:'error', error})});
  })
  .catch((error) => {console.log(error);res.json({status:'error', error})});
});

module.exports = router;
