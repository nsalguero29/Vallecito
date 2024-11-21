const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const ProductoVenta = sequelize.define('productoVenta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.DOUBLE, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'productoVenta', tableName: 'productosVentas'});
  return ProductoVenta;
}

module.exports = definir