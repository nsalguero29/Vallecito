var express = require('express');
var router = express.Router();
var funciones = require('../funciones');
var {Compra, DetalleCompra} = require('../../db/main');

/* COMPRAS */
/* POST NUEVO COMPRA */
router.post('/', async function(req, res, next) {
  const attributesCompra = req.body;
  const {productos, proveedorId} = attributesCompra;
  funciones.buscarProveedorId(proveedorId)
  .then(async ()=>{
    const productosIds = productos.reduce((acc, cur)=>{
      acc.push(cur.id);
      return acc;
    }, []);
    console.log(productosIds);
    funciones.buscarProductosIds(productosIds)
    .then(async (productosLista)=>{ 
      if(productosLista.length === productos.length){
        try {
          const compra = await Compra.create(attributesCompra);          
          if(productosLista.length != 0){
            productos.forEach(async (producto) => {
              await DetalleCompra.create({
                "compraId": compra.id,
                "productoId": producto.id,
                "cantidad": producto.cantidad,
                "precio": producto.precio,
                "observacion": producto.observacion
              });
            });
          }
          funciones.buscarFullCompraId(compra.id)
          .then((compra)=>{ res.json({ status:'ok', compra }); })
          .catch((error) => { console.log(error); res.json({status:'error', error}) });
        } catch (error) {
          console.log(error); res.json({status:'error', error});
        }
      }else{
        res.json({status:'error', error: "Algun Producto no encontrado"});
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

/* GET LISTADO COMPRAS */
router.get("/listar", function(req, res, next){
  const {tiposPagoFiltrados} = req.body;
  funciones.listarFullCompras(tiposPagoFiltrados)
  .then((compras)=>{ res.json({ status:'ok', compras }); })
  .catch((error) => { console.log(error); res.json({status:'error', error}) });
});

/* ANULAR UNA COMPRA */
router.delete('/eliminar', function(req, res, next) {
  const {id} = req.query;
  Compra.destroy({ where: {id} })
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
