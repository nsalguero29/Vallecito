const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Cliente = sequelize.define('cliente', {
    numCliente: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    documento: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    fechaNac: { type: DataTypes.DATE, allowNull: true },
    direccion: { type: DataTypes.STRING, allowNull: true },
    telefono: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    instagram: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'cliente', tableName: 'clientes'});
  return Cliente;
}

module.exports = definir