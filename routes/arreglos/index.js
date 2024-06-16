var express = require('express');
var router = express.Router();
const { Op, where } = require("sequelize");
var {Arreglo, Bicicleta, Cliente, Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor, Arreglo} = require('../../db/main');

var { attributesArreglo, attributesBicicleta, attributesMarca, attributesProducto, attributesProveedor } = require('../attributes.json');

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
  Arreglo.findAll({
    attributes: attributesArreglo,
    include:[{
        model: Bicicleta,
        include: { 
          model: Cliente 
        }
    }]
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

/* BUSCAR PRODUCTOS POR ID DE BICICLETA */
router.get('/filtrar', function(req, res, next){
  const {bicicletaId} = req.query;
  Arreglo.findAll({
    include: { 
      model: Bicicleta,
      include: { 
        model: Cliente 
      }
    },
    where:{ 
      bicicletaId,
      //estado: 'creado'
    }
  })
  .then((bicicletaArreglos)=>{
    console.log(bicicletaArreglos);
    res.json({
      status:'ok',
      bicicletaArreglos
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

module.exports = router;
