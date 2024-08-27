
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
var Modelo = require('./modelos/Modelo')(sequelize);
var Marca = require('./modelos/Marca')(sequelize);
var Producto = require('./modelos/Producto')(sequelize);
var ProductoArreglo = require('./modelos/ProductoArreglo')(sequelize);
var ProductoMarca = require('./modelos/ProductoMarca')(sequelize);
var ProductoProveedor = require('./modelos/ProductoProveedor')(sequelize);
var ProductoVenta = require('./modelos/ProductoVenta')(sequelize);
var Proveedor = require('./modelos/Proveedor')(sequelize);
var TiposProducto = require('./modelos/TiposProducto')(sequelize);
var Usuario = require('./modelos/Usuario')(sequelize);
var Venta = require('./modelos/Venta')(sequelize);

//RELACIONES

//MUCHOS PROD <-> MUCHOS ARREGLOS
Producto.belongsToMany(Arreglo, {
   through: ProductoArreglo, foreignKey: 'productoId', as:'arreglos'
});
Arreglo.belongsToMany(Producto, {
  through: ProductoArreglo, foreignKey: 'arregloId', as:'productos'
});

Producto.belongsTo(Marca, {
  targetKey: 'id', foreignKey: 'marcaId', 
  as:'marca'
});
Marca.hasMany(Producto, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'marcaId', as:'productos'
});

//1 PROD <-> 1 PROOVEDOR
Producto.belongsTo(Proveedor, {
  targetKey: 'id', foreignKey: 'proveedorId',
  as:'proveedor'
});
Proveedor.hasMany(Producto, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'proveedorId', as:'productos'
});

//MUCHAS COMPRAS <-> MUCHOS PROOD
Compra.belongsToMany(Producto, {
  through: DetalleCompra, foreignKey: 'compraId', as: 'productos' 
});
Producto.belongsToMany(Compra, {
 through: DetalleCompra, foreignKey: 'productoId', as: 'compras'
});

Proveedor.hasMany(Compra,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  sourceKey: 'id'
});

//1 Compra TIENE 1 Proveedor
Compra.belongsTo(Proveedor,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'proveedorId', sourceKey: 'id',  
  as: 'proveedor'
});

//1 BICI TIENE MUCHOS ARREGLOS
Bicicleta.hasMany(Arreglo,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  sourceKey: 'id', as:'arreglos'
});

//1 ARREGLO TIENE 1 BICI
Arreglo.belongsTo(Bicicleta,{
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'bicicletaId', sourceKey: 'id',  
  as: 'bicicleta'
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
Arreglo.belongsTo(Venta, {
  through: Arreglo, foreignKey: 'ventaId', as: 'venta'
})

//MUCHAS VENTAS <-> MUCHOS PRODUCTOS
Venta.belongsToMany(Producto, {
  through: ProductoVenta, foreignKey: 'productoId', as: 'productos'
});
Producto.belongsToMany(Venta, {
 through: ProductoVenta, foreignKey: 'ventaId', as: 'ventas'
});

TiposProducto.belongsToMany(Producto,{
  through: 'productoTipos', foreignKey: 'productoId', as: 'productos'
});
Producto.belongsToMany(TiposProducto, {
  through: 'productoTipos', foreignKey: 'productoTiposId', as: 'tiposProducto'
 });

Bicicleta.belongsTo(Marca, {
  targetKey: 'id', foreignKey: 'marcaId', 
  as:'marca'
});
Marca.hasMany(Bicicleta, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'marcaId', as:'bicicletas'
});

Bicicleta.belongsTo(Modelo, {
  targetKey: 'id', foreignKey: 'modeloId', 
  as:'modelo'
});
Modelo.hasMany(Bicicleta, {
  onDelete: 'RESTRICT', onUpdate: 'RESTRICT',
  foreignKey: 'modeloId', as:'bicicletas'
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
  Modelo,
  Marca,
  Producto,
  ProductoArreglo,
  ProductoMarca,
  ProductoProveedor,
  ProductoVenta,
  Proveedor,
  TiposProducto,
  Usuario,
  Venta
};