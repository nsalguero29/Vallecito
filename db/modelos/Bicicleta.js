const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Bicicleta = sequelize.define('bicileta', {
    marca: { type: DataTypes.STRING, allowNull: false },
    modelo: { type: DataTypes.STRING, allowNull: false },
    rodado: { type: DataTypes.STRING, allowNull: false },
    observacion: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'bicicleta', tableName: 'bicicletas'});
  return Bicicleta;
}

module.exports = definir