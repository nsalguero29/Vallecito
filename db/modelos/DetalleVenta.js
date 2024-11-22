const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const DetalleVenta = sequelize.define('detalleVenta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.DOUBLE, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'detalleVenta', tableName: 'detallesVentas'});
  return DetalleVenta;
}

module.exports = definir