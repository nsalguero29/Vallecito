const jwt = require('jsonwebtoken');
const { Usuario } = require('../db/main');
const { SECRETJWT, TOKEN_ADMIN } = process.env;

const admin = {
  documento:"1",
  user:"admin",
  id:0,
  tipo_usuario:1,
  nombre:"ADMIN",
  mail:"ADMIN@ADMIN"
}

const checkUser = function(token){
  return new Promise((resolve, reject) => {
    if (token !== undefined && token !== null){
      if(token === TOKEN_ADMIN) return resolve({status:"SUPERADMIN", user:admin});
      try {
        jwt.verify(token, SECRETJWT, function(error, decoded){
          if (error) throw(error)
          const usuario_id = decoded.data.id;
          Usuario.findOne({where:{id:usuario_id}})
          .then((usuario) => {
            if (usuario !== null) return resolve({status:"USUARIO", user:decoded.data})
            return reject({status:403, msj:"Usuario no encontrado"});
          })
          .catch((error) => reject({status:500, msj:error}));
        });
      } catch (error) { 
        let tokenError = "";
        if (error.name === 'JsonWebTokenError') tokenError = `Error en token: ${error}`;
        else if (error.name === 'TokenExpiredError') tokenError = `Token expirado: ${error.expiredAt}`;
        else tokenError = `Error desconocido: ${error}`;
        reject({status:403, msj:tokenError});
      }
    }else{
      resolve({status:"SIN TOKEN", user:null})
    }
  })
}

module.exports = {checkUser}