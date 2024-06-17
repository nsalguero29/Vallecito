var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var {Arreglo, Bicicleta, Cliente, Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor, Arreglo} = require('../../db/main');

var { attributesArreglo, attributesBicicleta, attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

const estadosCompleto = ["creado", "esperando", "reparando", "finalizado", "anulado"];

/* ARREGLOS */
/* POST NUEVO ARREGLO */
router.post('/nuevo', function(req, res, next) {
  const attributesArreglo = req.body;
  const {bicicletaId, repuestos} = req.body;
  Bicicleta.findOne({
    where: {id: bicicletaId}
  })
  .then(async (bicileta)=>{
    if(bicileta !== null){
      if(repuestos.length !== 0){

      }else{        
        Arreglo.create({
          ...attributesArreglo,
          bicicletaId
        })
        .then(async(arreglo)=>{
          //BicicletaArreglo.create({arregloId: arreglo.id, bicicletaId})
          //.then(()=>{
            res.json({
              status:'ok',
              arreglo
            });                  
          /*})
          .catch((error) => {
            console.log(error);
            res.json({status:'error', error})
          }); */
        })
        .catch((error) => {
          console.log(error);
          res.json({status:'error', error})
        });     
      }
    }else{
      res.json({status:'error', message:'Bicileta no encontrado'})
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
