const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Persona = sequelize.define('persona', {
    documento: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    fechaNac: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, paranoid: true, modelName: 'persona', tableName: 'personas'});
  return Persona;
}

module.exports = definir