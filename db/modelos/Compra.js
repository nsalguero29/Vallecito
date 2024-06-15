const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Compra = sequelize.define('compra', {
    numFactura: { type: DataTypes.STRING, allowNull: true },
    tipoPago: { type: DataTypes.ENUM, values:[
      'efectivo', 
      'transferencia', 
      'debito',
      'credito'      
    ], allowNull: false },
    valor: { type: DataTypes.DOUBLE, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'compra', tableName: 'compras'});
  return Compra;
}

module.exports = definir