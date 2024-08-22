var router = require('express').Router();
const fileUpload = require('express-fileupload');

var { Usuario } = require('../../db/main');
const { leerCSV } = require('../funciones');
const { guardarUsuarios } = require('./funciones');

router.use(fileUpload());

router.get("/", function(req, res, next){
  Usuario.findAll({
    attributes: ["documento", "nombre", "user", "tipo_usuario", "ultimo_ingreso"],
  })
  .then((usuarios) => {
    res.json({status:'ok', usuarios});
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
})

router.post("/archivo", function(req, res, next){
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send('No files were uploaded.');

  let archivo = req.files.archivo;
  leerCSV(archivo)
  .then((usuarios) => {
    guardarUsuarios(usuarios)
    .then((usuariosGuardados) => {
      res.json({status:'ok', usuarios:usuariosGuardados})
    })
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
})

router.post("/", function(req, res, next){
  const {documento, nombre, user, mail, tipo_usuario} = req.body;

  Usuario.create({ documento, nombre, user, mail, tipo_usuario, pass: documento })
  .then((usuario) => {
    res.json({status:'ok'})
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
})

router.put("/restablecer", function(req, res, next) {
  const {id} = req.query;
  Usuario.findOne({ where : { id } })
  .then((usuario) => {
    usuario.update({ pass: usuario.documento })
    .then(() => {
      res.json({status:"ok"})
    })
  })
  .catch((error) => {
    console.log(error);
    res.json({status:'error', error})
  })
})

/*
router.put("/", function(req, res, next){
  const {id} = req.query;
  const {documento, nombre, user, tipo_usuario} = req.body;

})

router.delete("/", function(req, res, next){
  const {id} = req.query;

})
*/

module.exports = router;