const { Op, where } = require("sequelize");
var { Arreglo, Bicicleta, Cliente, Marca, Producto, Proveedor, Arreglo, Venta, Compra, DetalleCompra} = require('../db/main');

var { attributesCliente, attributesBicicleta, attributesCompra, attributesMarca, attributesProducto, attributesProveedor, attributesVenta, attributesArreglo } = require('./attributes.json');
const estadosArreglosCompleto = ["creado", "esperando", "reparando", "finalizado", "anulado"];
const estadosVentasCompleto = ['creado', 'pagado', 'anulado'];
const tiposPagoCompleto = ['efectivo', 'transferencia', 'debito', 'credito'];

//#region CLIENTE
const buscarClienteId = function (clienteId) {
	return new Promise((resolve, reject) => {
		Cliente.findOne({ where: { id: clienteId } })
			.then((cliente) => {
				if (cliente != null) resolve(cliente);
				else reject("Cliente no encontrado");
			})
			.catch((error) => { console.log(error); reject(error) })
	})
}

const buscarClienteDocumento = function (documento) {
	return new Promise((resolve, reject) => {
		Cliente.findOne({ where: { documento } })
			.then((cliente) => {
				if (cliente != null) resolve(cliente);
				else reject("Cliente no encontrado");
			})
			.catch((error) => { console.log(error); reject(error) })
	})
}

const buscarClientesDocumento = function (documento) {
	return new Promise((resolve, reject) => {
		Cliente.findAll({
			attributes: attributesCliente,
			include: [{
				model: Bicicleta,
				attributes: attributesBicicleta
			}],
			where: { documento: { [Op.like]: documento + '%' } }
		})
			.then((clientes) => {
				if (clientes !== undefined) resolve(clientes);
				else resolve('Sin resultados');
			})
			.catch((error) => { console.log(error); reject(error) });
	})
}

//#endregion

//#region ARREGLOS
const buscarFullArregloId = function (arregloId) {
	return new Promise((resolve, reject) => {
		Arreglo.findOne({
			attributes: attributesArreglo,
			include: [{
				attributes: attributesProducto,
				model: Producto,
				as: 'productos'
			},{
				attributes: attributesBicicleta,
				model: Bicicleta,
				include: {
					attributes: attributesCliente,
					model: Cliente,
					as:'cliente'
				},
				as: 'bicicleta'	
			}],
			where: { id: arregloId }
		})
			.then((arreglo) => { resolve(arreglo); })
			.catch((error) => { console.log(error); reject(error) });
	})
}

const buscarFullArreglos = function (estadosFiltrados) {
	return new Promise((resolve, reject) => {
		Arreglo.findAll({
			attributes: attributesArreglo,
			include: [{
				attributes: attributesProducto,
				model: Producto,
				as: 'productos'
			},{
				attributes: attributesBicicleta,
				model: Bicicleta,
				include: {
					attributes: attributesCliente,
					model: Cliente,
					as:'cliente'
				},
				as: 'bicicleta'	
			}],
			where: {
				estado: {[Op.or]: estadosFiltrados? [estadosFiltrados] : estadosArreglosCompleto} 
			}
		})
		.then((arreglosLista) => { resolve(arreglosLista); })
		.catch((error) => { console.log(error); reject(error) });
	})
}

const buscarArreglosIds = function (arreglos) {
	return new Promise((resolve, reject) => {
		Arreglo.findAll({
			where: { id: { [Op.in]: arreglos } }
		})
		.then((arreglosLista) => { resolve(arreglosLista); })
		.catch((error) => { console.log(error); reject(error) });
	})
}

const buscarArregloId = function (arregloId) {
	return new Promise((resolve, reject) => {
		Arreglo.findOne({
			where: { id: arregloId  }
		})
		.then((arreglo) => { resolve(arreglo); })
		.catch((error) => { console.log(error); reject(error) });
	})
}
//#endregion

//#region PRODUCTOS
const buscarProductoId = function (productoId) {
	return new Promise((resolve, reject) => {
		Producto.findOne({ where: { id: productoId } })
			.then((producto) => {
				if (producto != null) resolve(producto);
				else reject("Producto no encontrado");
			})
			.catch((error) => { console.log(error); reject(error) })
	})
}

const buscarProductosIds = function (productos) {
	return new Promise((resolve, reject) => {
		Producto.findAll({
			where: { id: { [Op.in]: productos } }
		})
			.then((productosLista) => { resolve(productosLista); })
			.catch((error) => { reject(error) });
	})
}

const buscarFullProductoId = function (productoId) {
	return new Promise((resolve, reject) => {
		Producto.findOne({
			include: [{ 
			  model : Proveedor,
			  as : 'proveedores'
			}, { 
			  model : Marca,
			  as : 'marcas'
			}],
			where:{id : productoId}
		  })
		  .then((producto)=>{ resolve(producto); })
		  .catch((error) =>{ reject("Producto no encontrado"); });
	})
}

const buscarFullProductoNombre = function (producto) {
	return new Promise((resolve, reject) => {
		Producto.findAll({
			include: [{ 
			  model : Proveedor,
			  as : 'proveedores'
			}, { 
			  model : Marca,
			  as : 'marcas'
			}],
			where:{ 
				producto: { 
					[Op.like]: '%' + producto + '%'
				}
			}
		  })
		  .then((productos)=>{ resolve(productos); })
		  .catch((error) =>{ reject("Error al buscar productos"); });
	})
}

const listarProductos = function () {
	return new Promise((resolve, reject) => {
		Producto.findAll({
			attributes: ["id", "producto"]
		})
		.then((productos)=>{ resolve(productos); })
		.catch((error) => { console.log(error); reject(error) });
	})
}
//#endregion

//#region MARCAS
const buscarMarcaId = function (marcaId) {
	return new Promise((resolve, reject) => {
		Marca.findOne({ where: { id: marcaId } })
			.then((marca) => {
				if (marca != null) resolve(marca);
				else reject("Marca no encontrado");
			})
			.catch((error) => { console.log(error); reject(error) })
	})
}

const buscarMarcasIds = function (marcas) {
	return new Promise((resolve, reject) => {
		Marca.findAll({
			where: { id: { [Op.in]: marcas } }
		})
		.then((marcasLista) => { resolve(marcasLista); })
		.catch((error) => { console.log(error); reject(error) });
	})
}

const listarMarcas = function () {
	return new Promise((resolve, reject) => {
		Marca.findAll({
			attributes: ["id", "marca"]
		})
		.then((marcas)=>{ resolve(marcas); })
		.catch((error) => { console.log(error); reject(error) });
	})
}
//#endregion

//#region PROVEEDORES
const buscarProveedorId = function (proveedorId) {
	return new Promise((resolve, reject) => {
		Proveedor.findOne({
			include: { model: Producto, as : 'productos'},
			where: { id: proveedorId } 
		})
		.then((proveedor) => {
			if (proveedor != null) resolve(proveedor);
			else reject("Proveedor no encontrado");
		})
		.catch((error) => { console.log(error); reject(error) })
	})
}

const buscarProveedores = function (proveedor) {
	return new Promise((resolve, reject) => {
		Proveedor.findAll({
			include: { model: Producto, as : 'productos'},
			where: { proveedor: { [Op.like]: '%' + proveedor + '%' } } 
		})
		.then((proveedor) => {
			if (proveedor != null) resolve(proveedor);
			else reject("Proveedor no encontrado");
		})
		.catch((error) => { console.log(error); reject(error) })
	})
}

const buscarProveedoresIds = function (proveedores){
	return new Promise((resolve, reject) => {
		Proveedor.findAll({
			where: { id: { [Op.in]: proveedores } }
		})
			.then((proveedoresLista) => { resolve(proveedoresLista); })
			.catch((error) => { console.log(error); reject(error) });
	})
} 

const listarProveedores = function () {
	return new Promise((resolve, reject) => {
		Proveedor.findAll({
			attributes: ["id", "proveedor"]
		})
		.then((proveedores)=>{ resolve(proveedores); })
		.catch((error) => { console.log(error); reject(error) });
	})
}
//#endregion

//#region BICICLETAS
const buscarBicicletaId = function (bicicletaId) {
	return new Promise((resolve, reject) => {
		Bicicleta.findOne({ where: { id: bicicletaId } })
			.then((bicicleta) => {
				if (bicicleta != null) resolve(bicicleta);
				else reject("Bicicleta no encontrada");
			})
			.catch((error) => { console.log(error); reject(error) })
	})
}
//#endregion

//#region VENTAS
const buscarVentaId = function (ventaId){
	return new Promise((resolve, reject) => {
		Venta.findOne({
			include : {all: true},
			where: {id:ventaId}
		})
		.then((venta) => { console.log(venta); resolve(venta); })
		.catch((error) => { console.log(error); reject(error); });
	})
}

const buscarFullVentaId = function (ventaId) {
	return new Promise((resolve, reject) => {
		Venta.findOne({
			attributes: attributesVenta,
			include:[{
				model: Cliente
			},
			{
			  model: Arreglo,
			  include: [{ 
				  model: Producto,
					as: 'productos'
				},
				{ 
				  model: Bicicleta,
					as:'bicicleta'
				}]
			},
			{
			  model: Producto,
				as: 'productos'
			}],
			where:{ 
				id: ventaId
			}
		  })
		.then((venta) => { console.log(venta); resolve(venta); })
		.catch((error) => { console.log(error); reject(error); });
	})
}

const listarFullVentas = function (tiposPagoFiltrados, facturadas) {
	return new Promise((resolve, reject) => {
		Venta.findAll({
			attributes: attributesVenta,
			include:[{
				attributes: attributesCliente,
				model: Cliente
			},
			{
				attributes: attributesArreglo,
			  model: Arreglo,
			  include: [{ 
					attributes: attributesProducto,
				  model: Producto,
					as: 'productos'
				},
				{ 
					attributes: attributesBicicleta,
				  model: Bicicleta,
					as:'bicicleta'
				}]
			},
			{
				attributes: attributesProducto,
			  model: Producto,
				as: 'productos'
			}],
			where:{
				tipoPago: {[Op.or]: tiposPagoFiltrados? [tiposPagoFiltrados] : tiposPagoCompleto},
				facturada: facturadas? facturadas:{[Op.or]: [true,false]}
			}
		  })
		.then((arreglo) => { console.log(arreglo); resolve(arreglo); })
		.catch((error) => { console.log(error); reject(error) });
	})
}

//#endregion

//#region COMPRAS
const buscarCompraId = function (compraId){
	return new Promise((resolve, reject) => {
		Compra.findOne({
			include : {all: true},
			where: {id:compraId}
		})
		.then((compra) => { console.log(compra); resolve(compra); })
		.catch((error) => { console.log(error); reject(error); });
	})
}

const buscarFullCompraId = function (compraId) {
	return new Promise((resolve, reject) => {
		Compra.findOne({
			attributes: attributesCompra,
			include:[{
				attributes: attributesProducto,
				model: Producto,
				as: 'productos'
			}],
			where:{ 
				id: compraId
			}
		  })
		.then((compra) => { resolve(compra); })
		.catch((error) => { console.log(error); reject(error) });
	})
}

const listarFullCompras = function (tiposPagoFiltrados) {
	return new Promise((resolve, reject) => {
		Compra.findAll({
			attributes: attributesCompra,
			include:[{
			  attributes: attributesProducto,
				model: Producto,
				as: 'productos'
			}],
			where:{ 
				tipoPago: {[Op.or]: tiposPagoFiltrados? [tiposPagoFiltrados] : tiposPagoCompleto}
			}
		})
		.then((compra) => { resolve(compra); })
		.catch((error) => { console.log(error); reject(error) });
	})
}

//#endregion


module.exports = {
//CLIENTES
	buscarClienteDocumento,
	buscarClientesDocumento,
	buscarClienteId,
//BICICLETAS
	buscarBicicletaId,
//ARREGLOS
	buscarFullArregloId,
	buscarFullArreglos,
	buscarArreglosIds,
	buscarArregloId,
//PRODUCTOS
	buscarProductoId,
	buscarProductosIds,
	buscarFullProductoId,
	buscarFullProductoNombre,
	listarProductos,
//MARCAS
	buscarMarcaId,
	buscarMarcasIds,
	listarMarcas,
//PROVEEDORES
	buscarProveedorId,
	buscarProveedoresIds,
	buscarProveedores,
	listarProveedores,
//VENTAS
	buscarVentaId,
	buscarFullVentaId,
	listarFullVentas,
//COMPRAS
	buscarCompraId,
	buscarFullCompraId,
	listarFullCompras
}