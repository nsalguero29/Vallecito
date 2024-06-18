const { DataTypes } = require("sequelize"); // Import the built-in data types

function definir(sequelize){
  const ProductoMarca = sequelize.define('productoMarca', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { sequelize, modelName: 'productoMarca', tableName: 'productosMarcas'});
  return ProductoMarca;
}

module.exports = definir