const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const TiposProducto = sequelize.define('tiposProducto', {
    tipoProducto: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'tiposProducto', tableName: 'tiposProducto'});
  return TiposProducto;
}

module.exports = definir