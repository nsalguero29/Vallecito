var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var funciones = require('../funciones');

var {Arreglo, Bicicleta, Cliente, Producto, Arreglo} = require('../../db/main');


/* ARREGLOS */
/* POST NUEVO ARREGLO */
router.post('/nuevo', async function(req, res, next) {
  const attributesArreglo = req.body;
  const {bicicletaId, repuestos} = attributesArreglo;
  funciones.buscarBicicletaId(bicicletaId)
  .then(async (bicicleta)=>{
    if(bicicleta != null){
      funciones.buscarProductosIds(repuestos)
      .then(async (repuestosLista)=>{
        if(repuestosLista.length === repuestos.length){
          const arreglo = await Arreglo.create({...attributesArreglo, bicicletaId});
          await arreglo.addProductos(repuestos);
          funciones.buscarFullArregloId(arreglo.id)
          .then((arreglo)=>{res.json({status:'ok', arreglo});})
          .catch((error) =>{ console.log(error); res.json({status:'error', error}); });   
        }else{
          res.json({status:'error', "error":"Repuestos no encontrados"});
        }
      })
    }else{
      res.json({status:'error', "error":"Bicicleta no encontrada"});
    }
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  });
})

/* GET LISTADO ARREGLOS */
router.get("/listar", function(req, res, next){
  const {estadosFiltrados} = req.body;
  funciones.buscarFullArreglos(estadosFiltrados)
  .then((arreglos)=>{
    res.json({ status:'ok',arreglos });
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
    include:[{
        model: Bicicleta,
        include: { 
          model: Cliente 
        }
    },
    {
      model: Producto,
    }
    ],
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
  const {bicicletaId, repuestos} = attributesArreglo;
  funciones.buscarArregloId(id)
  .then((arreglo)=>{
    if(arreglo === null){
      res.json({status:'error', 'error': 'Arreglo no encontrado'});
    }else{
      funciones.buscarBicicletaId(bicicletaId)
      .then(async (bicicleta)=>{
        if(bicicleta != null){
          funciones.buscarProductosIds(repuestos)
          .then(async (repuestosLista)=>{
            if(repuestosLista.length === repuestos.length){
              try {
                await arreglo.set(attributesArreglo);
                await arreglo.setProductos(repuestos);
                funciones.buscarFullArregloId(id)
                .then((arreglo)=>{res.json({status:'ok', arreglo});})
                .catch((error) =>{ console.log(error); res.json({status:'error', error}); });
              } catch (error) {
                console.log(error); res.json({status:'error', error});
              }
            }else{
              res.json({status:'error', "error":"Repuestos no encontrados"});
            }
          })
        }else{
          res.json({status:'error', "error":"Bicicleta no encontrada"});
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({status:'error', error})
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
