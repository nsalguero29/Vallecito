
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
  through: 'productoMarca', foreignKey: 'productoId', sourceKey: 'id' 
});
Marca.belongsToMany(Producto, {
 through: 'productoMarca', foreignKey: 'marcaId', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHOS ARREGLO
Producto.belongsToMany(Arreglo, {
   through: 'productoArreglo', foreignKey: 'productoId', sourceKey: 'id' 
});
Arreglo.belongsToMany(Producto, {
  through: 'productoArreglo', foreignKey: 'arregloId', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHOS PROOVEDOR
Producto.belongsToMany(Proveedor, {
  through: 'productoProveedor', foreignKey: 'proveedorId', sourceKey: 'id' 
});
Proveedor.belongsToMany(Producto, {
 through: 'productoProveedor', foreignKey: 'productoId', sourceKey: 'id' 
});

//1 COMPRA -> MUCHOS DETALLES
Compra.hasMany(DetalleCompra, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'compraId', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHOS DETALLES
Producto.belongsToMany(DetalleCompra, {
  through: 'detalleCompra', foreignKey: 'productoId', sourceKey: 'id' 
 });
DetalleCompra.belongsToMany(Producto, {
 through: 'detalleCompra', foreignKey: 'compraId', sourceKey: 'id' 
});

//MUCHAS COMPRAS <-> MUCHOS PROOV
Compra.belongsToMany(Proveedor, {
  through: 'detalleCompra', foreignKey: 'proveedorId', sourceKey: 'id' 
});
Proveedor.belongsToMany(Compra, {
 through: 'detalleCompra', foreignKey: 'compraId', sourceKey: 'id' 
});

//1 BICI -> MUCHOS ARREGLOS
Bicicleta.hasMany(Arreglo, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'biciletaId', sourceKey: 'id'
});

//1 CLIENTE -> MUCHAS BICI
Cliente.hasMany(Bicicleta,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'clienteId', sourceKey: 'id',  
});
Bicicleta.belongsTo(Cliente);

//1 CLIENTE -> MUCHAS VENTAS
Cliente.hasMany(Venta, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'clienteId', sourceKey: 'id',
});

//1 VENTA -> MUCHOS ARREGLOS
Venta.hasMany(Arreglo, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'ventaId', sourceKey: 'id', 
});

//MUCHAS VENTAS <-> MUCHOS PRODUCTOS
Venta.belongsToMany(Producto, {
  through: 'productoVenta', foreignKey: 'productoId', sourceKey: 'id' 
});
Producto.belongsToMany(Venta, {
 through: 'productoVenta', foreignKey: 'ventaId', sourceKey: 'id' 
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