const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const DetalleCompra = sequelize.define('detalleCompra', {
    cantidad: { type: DataTypes.INTEGER, allowNull: true },
    precio: { type: DataTypes.DOUBLE, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'detalleCompra', tableName: 'detallesCompras'});
  return DetalleCompra;
}

module.exports = definir