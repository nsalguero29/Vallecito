const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Producto = sequelize.define('producto', {
    producto: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    precioVenta: { type: DataTypes.DOUBLE, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'producto', tableName: 'productos'});
  return Producto;
}

module.exports = definir