const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const Bicicleta = sequelize.define('bicileta', {
    modelo: { type: DataTypes.STRING, allowNull: true },
    rodado: { type: DataTypes.ENUM, values:[
      '12', 
      '14', 
      '16',
      '20',
      '24',
      '26',
      '27.5',
      '29'
    ], allowNull: true },
    observacion: { type: DataTypes.STRING, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'bicicleta', tableName: 'bicicletas'});
  return Bicicleta;
}

module.exports = definir