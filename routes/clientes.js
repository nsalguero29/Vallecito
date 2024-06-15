var express = require('express');
var router = express.Router();

var { Cliente } = require('../db/main');

const attributes = [
  'documento',
  'apellido',
  'nombre',
  'fechaNac',
  'direccion',
  'telefono',
  'email',
  'instagram'
];

/* POST NUEVO CLIENTE */
router.post('/nuevo', function(req, res, next) {
  const attributes = req.body;
  Cliente.create(attributes)
  .then((cliente)=>{
    res.json({
      status:'ok',
      cliente: cliente
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* GET LISTADO CLIENTES */
router.get("/listar", function(req, res, next){
  Cliente.findAll({
    attributes
  })
  .then((clientes)=>{
    res.json({
      status:'ok',
      clientes: clientes
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

/* ACTUALIZAR UN CLIENTE */
router.put('/actualiza', function(req, res, next) {
  const {id} = req.query;
  const attributes = req.body;
  Cliente.update(
    attributes,
    { where: {id} }
  )
  .then((cliente)=>{
    res.json({
      status:'ok',
      cliente: cliente
    });
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
});

router.delete('/elimina', function(req, res, next) {
  const {id} = req.query;
  Cliente.destroy({ where: {id} })
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
