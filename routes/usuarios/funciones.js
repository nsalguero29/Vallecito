var { Usuario } = require('../../db/main');

const guardarUsuarios = function(usuarios){
  return new Promise((resolve, reject) => {
    Usuario.bulkCreate(usuarios)
    .then((uGuardados) => resolve(uGuardados))
    .catch((error) => reject(error));
  })
}

module.exports = { guardarUsuarios }