var router = require('express').Router();
const bcrypt = require('bcrypt');
var { Usuario } = require('../../db/main');

var jwt = require('jsonwebtoken');

const { SECRETJWT } = process.env;
const EXP = (3 * 60 * 60) //expira en 3 horas

router.post("/login", function(req, res, next){
  const {user, pass} = req.body;

  Usuario.findOne({ where: { user: user } })
  .then((usuario) => {
    if(usuario!== null){
      bcrypt.compare(pass, usuario.pass).then(function(result) {
        if (result) {
          usuario.update({ ultimo_ingreso: new Date() })
          .then(() => {
            const datos = {
              id: usuario.id,
              user: usuario.user,
              nombre: usuario.nombre,
              tipo: usuario.tipo_usuario
            }
            
            const token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + EXP,
              data: datos
            }, SECRETJWT);

            res.json({
              status:'ok',
              datos,
              token
            })
          })
          .catch((error)=>res.json({ status:'error', error }));
        } else {
          res.json({ status:'error', error:'usuario y/o contraseña incorrecto' })
        }
      });
    }else{
      res.json({ status:'error', error:'usuario y/o contraseña incorrecto' })
    }
  })
  .catch((error) => {
    console.log(error);
    res.json({ status:'error', error })
  })
})

module.exports = router;