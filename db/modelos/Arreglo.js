const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Arreglo = sequelize.define('arreglo', {
    observacion: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'arreglo', tableName: 'arreglos'});
  return Arreglo;
}

module.exports = definir