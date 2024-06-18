const { Op } = require("sequelize");
var { Arreglo, Bicicleta, Cliente, Marca, Producto, Proveedor, Arreglo, Venta } = require('../db/main');

var { attributesCliente, attributesBicicleta, attributesMarca, attributesProducto, attributesProveedor, attributesVenta } = require('./attributes.json');
const estadosCompleto = ["creado", "esperando", "reparando", "finalizado", "anulado"];

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

const buscarArreglosIds = function (arreglos) {
	return new Promise((resolve, reject) => {
		Arreglo.findAll({
			where: { id: { [Op.in]: arreglos } }
		})
			.then((arreglosLista) => { resolve(arreglosLista); })
			.catch((error) => { console.log(error); reject(error) });
	})
}

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
			.catch((error) => { console.log(error); reject(error) });
	})
}

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

const buscarProveedorId = function (proveedorId) {
	return new Promise((resolve, reject) => {
		Proveedor.findOne({ where: { id: proveedorId } })
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

const buscarBicicletaId = function (bicicletaId) {
	return new Promise((resolve, reject) => {
		Bicicleta.findOne({ where: { id: bicicletaId } })
			.then((bicicleta) => {
				if (bicicleta != null) resolve(bicicleta);
				else reject("Bicicleta no encontrado");
			})
			.catch((error) => { console.log(error); reject(error) })
	})
}

const filtrarClientesDocumento = function (documento) {
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

module.exports = {
	buscarClienteDocumento,
	filtrarClientesDocumento,
	buscarClienteId,
	buscarArreglosIds,
	buscarProductoId,
	buscarProductosIds,
	buscarMarcaId,
	buscarMarcasIds,
	buscarProveedorId,
	buscarBicicletaId,
	buscarProveedoresIds
}