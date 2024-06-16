const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const DetalleCompra = sequelize.define('detalleCompra', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'detalleCompra', tableName: 'detallesCompras'});
  return DetalleCompra;
}

module.exports = definir