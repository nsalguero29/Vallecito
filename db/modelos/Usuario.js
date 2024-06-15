const bcrypt = require('bcrypt');
const { DataTypes } = require("sequelize"); // Import the built-in data types
const saltRounds = 10;

function definir(sequelize){
  const Usuario = sequelize.define('usuario', {
    documento: { type: DataTypes.STRING, allowNull: false },
    nombre: { type: DataTypes.STRING, allowNull: false },
    user: { type: DataTypes.STRING, allowNull: false },
    tipo_usuario: { type: DataTypes.INTEGER, allowNull: false },
    pass: { 
      type: DataTypes.STRING, allowNull: true,
      set(value) {
        const hash = bcrypt.hashSync(value, saltRounds);
        this.setDataValue('pass', hash);
      }, 
    },
    ultimo_ingreso: { type: DataTypes.DATE, allowNull: true },
  }, { sequelize, paranoid: true, modelName: 'usuario', tableName: 'usuarios'});

  return Usuario;
}

module.exports = definir