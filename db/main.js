
const { Sequelize } = require('sequelize');

const {DB, DBUSER, DBPASS, DBHOST, DBPORT} = process.env;

const cn = `postgres://${DBUSER}:${DBPASS}@${DBHOST}:${DBPORT}/${DB}`;

const sequelize = new Sequelize(cn, {logging: false});

//MODELOS
var Arreglo = require('./modelos/Arreglo')(sequelize);
var Bicicleta = require('./modelos/Bicicleta')(sequelize);
var Cliente = require('./modelos/Cliente')(sequelize);
var Compra = require('./modelos/Compra')(sequelize);
var DetalleCompra = require('./modelos/DetalleCompra')(sequelize);
var Marca = require('./modelos/Marca')(sequelize);
var Producto = require('./modelos/Producto')(sequelize);
var Proveedor = require('./modelos/Proveedor')(sequelize);
var Usuario = require('./modelos/Usuario')(sequelize);
var Venta = require('./modelos/Venta')(sequelize);

//RELACIONES

//MUCHOS PROD <-> MUCHAS MARCA
Producto.belongsToMany(Marca, {
  through: 'productoMarca', foreignKey: 'producto_id', sourceKey: 'id' 
});
Marca.belongsToMany(Producto, {
 through: 'productoMarca', foreignKey: 'marca_id', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHOS ARREGLO
Producto.belongsToMany(Arreglo, {
   through: 'productoArreglo', foreignKey: 'producto_id', sourceKey: 'id' 
});
Arreglo.belongsToMany(Producto, {
  through: 'productoArreglo', foreignKey: 'arreglo_id', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHOS PROOVEDOR
Producto.belongsToMany(Proveedor, {
  through: 'productoProveedor', foreignKey: 'proveedor_id', sourceKey: 'id' 
});
Proveedor.belongsToMany(Producto, {
 through: 'productoProveedor', foreignKey: 'producto_id', sourceKey: 'id' 
});

//1 COMPRA -> MUCHOS DETALLES
Compra.hasMany(DetalleCompra, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'compra_id', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHOS DETALLES
Producto.belongsToMany(DetalleCompra, {
  through: 'detalleCompra', foreignKey: 'producto_id', sourceKey: 'id' 
 });
DetalleCompra.belongsToMany(Producto, {
 through: 'detalleCompra', foreignKey: 'compra_id', sourceKey: 'id' 
});

//MUCHAS COMPRAS <-> MUCHOS PROOV
Compra.belongsToMany(Proveedor, {
  through: 'detalleCompra', foreignKey: 'proveedor_id', sourceKey: 'id' 
});
Proveedor.belongsToMany(Compra, {
 through: 'detalleCompra', foreignKey: 'compra_id', sourceKey: 'id' 
});

//1 BICI -> MUCHOS ARREGLOS
Bicicleta.hasMany(Arreglo, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'bicileta_id', sourceKey: 'id',
  as: "bicicleta"
});

//1 CLIENTE -> MUCHAS BICI
Cliente.hasMany(Bicicleta,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'cliente_id', sourceKey: 'id',  
});

//1 CLIENTE -> MUCHAS VENTAS
Cliente.hasMany(Venta, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'cliente_id', sourceKey: 'id',
});

//1 VENTA -> MUCHOS ARREGLOS
Venta.hasMany(Arreglo, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'venta_id', sourceKey: 'id', 
});

//MUCHAS VENTAS <-> MUCHOS PRODUCTOS
Venta.belongsToMany(Producto, {
  through: 'productoVenta', foreignKey: 'producto_id', sourceKey: 'id' 
});
Producto.belongsToMany(Venta, {
 through: 'productoVenta', foreignKey: 'venta_id', sourceKey: 'id' 
});


function iniciarDB(tipo = 'sync'){
  return new Promise((resolve, reject) => {
    try {
      sequelize.authenticate({})
      .then(async() => {
        await sequelize.sync({ [tipo]: true });
        resolve();
      })
      .catch((error) => reject(error))
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  iniciarDB,
  Arreglo,
  Bicicleta,
  Cliente,
  Compra,
  DetalleCompra,
  Marca,
  Producto,
  Proveedor,
  Usuario,
  Venta
};