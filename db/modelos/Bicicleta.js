const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Bicicleta = sequelize.define('bicileta', {
    modelo: { type: DataTypes.STRING, allowNull: false },
    rodado: { type: DataTypes.INTEGER, allowNull: false },
    observacion: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, paranoid: true, modelName: 'bicicleta', tableName: 'bicicletas'});
  return Bicicleta;
}

module.exports = definir