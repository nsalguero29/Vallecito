
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
var ProductoArreglo = require('./modelos/ProductoArreglo')(sequelize);
var ProductoMarca = require('./modelos/ProductoMarca')(sequelize);
var ProductoProveedor = require('./modelos/ProductoProveedor')(sequelize);
var ProductoVenta = require('./modelos/ProductoVenta')(sequelize);
var Proveedor = require('./modelos/Proveedor')(sequelize);
var Usuario = require('./modelos/Usuario')(sequelize);
var Venta = require('./modelos/Venta')(sequelize);

//RELACIONES

//MUCHOS PROD <-> MUCHOS ARREGLOS
Producto.belongsToMany(Arreglo, {
   through: ProductoArreglo, foreignKey: 'productoId', sourceKey: 'id' 
});
Arreglo.belongsToMany(Producto, {
  through: ProductoArreglo, foreignKey: 'arregloId', sourceKey: 'id' 
});

//MUCHOS PROD <-> MUCHAS MARCA
Producto.belongsToMany(Marca, {
  through: ProductoMarca, foreignKey: 'productoId', as:'marcas' 
});
Marca.belongsToMany(Producto, {
 through: ProductoMarca, foreignKey: 'marcaId', as:'productos'
});

//MUCHOS PROD <-> MUCHOS PROOVEDOR
Producto.belongsToMany(Proveedor, {
  through: ProductoProveedor, foreignKey: 'productoId', as: 'proveedors'
});
Proveedor.belongsToMany(Producto, {
 through: ProductoProveedor, foreignKey: 'proveedorId', as: 'productos'
});

//1 COMPRA -> MUCHOS DETALLES
Compra.hasMany(DetalleCompra, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'compraId', sourceKey: 'id' 
});

//1 PROD <-> MUCHOS DETALLES
Producto.belongsToMany(DetalleCompra, {
  through: DetalleCompra, foreignKey: 'productoId', sourceKey: 'id' 
 });
DetalleCompra.belongsToMany(Producto, {
 through: DetalleCompra, foreignKey: 'compraId', sourceKey: 'id' 
});

//MUCHAS COMPRAS <-> MUCHOS PROOV
Compra.belongsToMany(Proveedor, {
  through: DetalleCompra, foreignKey: 'proveedorId', sourceKey: 'id' 
});
Proveedor.belongsToMany(Compra, {
 through: DetalleCompra, foreignKey: 'compraId', sourceKey: 'id' 
});

//1 BICI TIENE MUCHOS ARREGLOS
Bicicleta.hasMany(Arreglo,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  sourceKey: 'id',
});

//1 ARREGLO TIENE 1 BICI
Arreglo.belongsTo(Bicicleta,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'bicicletaId', sourceKey: 'id',  
});

//1 CLIENTE -> MUCHAS BICI
Cliente.hasMany(Bicicleta,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'clienteId', sourceKey: 'id', 
  as: 'bicicletas' 
});
Bicicleta.belongsTo(Cliente);

//1 CLIENTE -> MUCHAS VENTAS
Cliente.hasMany(Venta, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'clienteId', sourceKey: 'id',
  as: 'ventas'
});
Venta.belongsTo(Cliente);

//1 VENTA -> MUCHOS ARREGLOS
Venta.hasMany(Arreglo, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'ventaId', sourceKey: 'id', 
});

//MUCHAS VENTAS <-> MUCHOS PRODUCTOS
Venta.belongsToMany(Producto, {
  through: ProductoVenta, foreignKey: 'productoId', sourceKey: 'id' 
});
Producto.belongsToMany(Venta, {
 through: ProductoVenta, foreignKey: 'ventaId', sourceKey: 'id' 
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
  ProductoArreglo,
  ProductoMarca,
  ProductoProveedor,
  ProductoVenta,
  Proveedor,
  Usuario,
  Venta
};