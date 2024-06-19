var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var funciones = require('../funciones');

var {Arreglo, Bicicleta, Cliente, Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor, Arreglo, ProductoArreglo} = require('../../db/main');

var { attributesArreglo} = require('../attributes.json');

const estadosCompleto = ["creado", "esperando", "reparando", "finalizado", "anulado"];

/* ARREGLOS */
/* POST NUEVO ARREGLO */
router.post('/nuevo', async function(req, res, next) {
  const attributesArreglo = req.body;
  const {bicicletaId, repuestos} = req.body;
  funciones.buscarBicicletaId(bicicletaId)
  .then(async (bicicleta)=>{
    if(bicicleta != null){
      funciones.buscarProductosIds(repuestos)
      .then(async (repuestosLista)=>{
        if(repuestosLista.length === repuestos.length){
          const arreglo = await Arreglo.build({...attributesArreglo, bicicletaId});
          //arreglo.setBicicleta(bicicletaId);
          await arreglo.addProductos(repuestos);
          await arreglo.save();          
          res.json({status:'ok', arreglo});          
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
  Arreglo.findAll({
    attributes: attributesArreglo,
    include:[{
        model: Bicicleta,
        include: { 
          model: Cliente 
        },
        as: 'bicicleta'
    },
    {
      model: Producto,
    }
    ],
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
