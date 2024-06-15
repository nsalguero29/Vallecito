const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Marca = sequelize.define('marca', {
    marca: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'marca', tableName: 'marcas'});
  return Marca;
}

module.exports = definir