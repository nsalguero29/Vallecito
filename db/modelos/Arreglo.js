const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Arreglo = sequelize.define('arreglo', {
    estado: { type: DataTypes.ENUM, values:['creado', 'esperando', 'reparando', 'finalizado'], defaultValue:'creado', allowNull: false },
    trabajo: { type: DataTypes.STRING, allowNull: false },
    valorArreglo: { type: DataTypes.DOUBLE, allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'arreglo', tableName: 'arreglos'});
  return Arreglo;
}

module.exports = definir