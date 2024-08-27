const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Modelo = sequelize.define('modelo', {
    modelo: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'modelo', tableName: 'modelos'});
  return Modelo;
}

module.exports = definir