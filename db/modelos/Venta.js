const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Ventas = sequelize.define('venta', {
    numFactura: { type: DataTypes.STRING, allowNull: true },
    tipoPago: { type: DataTypes.ENUM, values:[
      'efectivo', 
      'transferencia', 
      'debito',
      'credito'      
    ], allowNull: false },
    valorFinal: { type: DataTypes.DOUBLE, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.ENUM, values:['creado', 'pagado', 'anulado'], defaultValue:'creado', allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'venta', tableName: 'ventas'});
  return Ventas;
}

module.exports = definir