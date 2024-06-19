const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Proveedor = sequelize.define('proveedor', {
    proveedor: { type: DataTypes.STRING, allowNull: false },
    nombreContacto: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    instagram: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'proveedor', tableName: 'proveedores'});
  return Proveedor;
}

module.exports = definir