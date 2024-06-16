var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");
var {Arreglo, Bicicleta, BicicletaArreglo, Marca, Producto, ProductoMarca, Proveedor, ProductoProveedor, Arreglo} = require('../../db/main');

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
        Arreglo.create(attributesArreglo)
        .then(async(arreglo)=>{
          BicicletaArreglo.create({arregloId: arreglo.id, bicicletaId})
          .then(()=>{
            res.json({
              status:'ok',
              arreglo
            });                  
          })
          .catch((error) => {
            console.log(error);
            res.json({status:'error', error})
          }); 
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
        through: { attributesBicicleta },
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

/* ELIMINA UN PRODUCTO */
router.delete('/elimina', function(req, res, next) {
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
router.get('/filtrar', function(req, res, next){
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
