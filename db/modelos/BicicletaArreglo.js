const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const BicicletaArreglo = sequelize.define('bicicletaArreglo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'bicicletaArreglo', tableName: 'bicicletaArreglos'});
  return BicicletaArreglo;
}

module.exports = definir