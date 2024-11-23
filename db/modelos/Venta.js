const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Ventas = sequelize.define('venta', {
    numFactura: { type: DataTypes.STRING, allowNull: true },
    fechaVenta: { type:  DataTypes.DATEONLY, allowNull: true },  
    tipoPago: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: { isIn: [['efectivo', 'transferencia', 'debito', 'credito', 'cheque']] },
      defaultValue:'efectivo'
    },
    observacion: { type: DataTypes.STRING, allowNull: true },
    valorFinal: { type: DataTypes.DOUBLE, allowNull: true },
    facturada: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, { sequelize, paranoid: true, modelName: 'venta', tableName: 'ventas'});
  return Ventas;
}

module.exports = definir