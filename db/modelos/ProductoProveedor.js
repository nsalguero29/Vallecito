const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const ProductoProveedor = sequelize.define('productoProveedor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  }, { sequelize, modelName: 'productoProveedor', tableName: 'productosProveedores'});
  return ProductoProveedor;
}

module.exports = definir