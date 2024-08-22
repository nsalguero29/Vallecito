var router = require('express').Router();
var jwt = require('jsonwebtoken');

var agenteRouter = require('./agente');  
var adminRouter = require('./admin');  

const { SECRETJWT, TOKEN_ADMIN } = process.env;

router.use(function(req, res, next) {
  const token = req.headers.authorization;
  if (token !== undefined && token !== null){
    if(token === TOKEN_ADMIN) return(adminRouter(req, res, next));
    try {
      let decoded = jwt.verify(token, SECRETJWT);
      req.user_id = decoded.data.id;
      
      if(decoded.data.tipo === 2) return(adminRouter(req, res, next));
    } catch (error) { 
      if (error.name === 'JsonWebTokenError')
        console.log(`Error en token: ${error}`);
      else if (error.name === 'TokenExpiredError')
        console.log(`Token expirado: ${error.expiredAt}`);
      else
        console.log(`Error desconocido: ${error}`);
      res.json({status:"error", error})
    }
  }else{
    return(agenteRouter(req, res, next));
  }
  
  //return(agenteRouter(req, res, next));
  //return(adminRouter(req, res, next));
})


module.exports = router;