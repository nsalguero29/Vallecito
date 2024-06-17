const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const ProductoArreglo = sequelize.define('productoArreglo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    cantidad: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'productoArreglo', tableName: 'productosArreglo'});
  return ProductoArreglo;
}

module.exports = definir