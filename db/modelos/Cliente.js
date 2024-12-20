const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Cliente = sequelize.define('cliente', {
    documento: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: true },
    nombres: { type: DataTypes.STRING, allowNull: true },
    fechaNac: { type: DataTypes.DATEONLY, allowNull: true },
    direccion: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    instagram: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'cliente', tableName: 'clientes'});
  return Cliente;
}

module.exports = definir