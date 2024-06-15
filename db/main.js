
const { Sequelize } = require('sequelize');

const {DB, DBUSER, DBPASS, DBHOST, DBPORT} = process.env;

const cn = `postgres://${DBUSER}:${DBPASS}@${DBHOST}:${DBPORT}/${DB}`;

const sequelize = new Sequelize(cn, {logging: false});

var Persona = require('./modelos/Persona')(sequelize);
var Bicicleta = require('./modelos/Bicicleta')(sequelize);
var Arreglo = require('./modelos/Arreglo')(sequelize);

function iniciarDB(tipo = 'sync'){
  return new Promise((resolve, reject) => {
    try {
      sequelize.authenticate({})
      .then(async() => {
        await sequelize.sync({ [tipo]: true });
        resolve();
      })
      .catch((error) => reject(error))
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {iniciarDB, Persona, Bicicleta, Arreglo};