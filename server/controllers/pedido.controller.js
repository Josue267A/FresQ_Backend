const { validationResult } = require('express-validator');
const sequelize = require('../config/sequelize.config');
const Pedido = require('../models/pedido.model');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jsonwebtoken

// Función para generar un código único
function generateUniqueCode() {
    return (
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(48 + Math.floor(Math.random() * 10)) +
        String.fromCharCode(48 + Math.floor(Math.random() * 10))
    );
}

// Obtener pedidos activos del cliente
exports.getPedidosActivosCliente = async (req, res) => {
    const idCliente = req.params.idCliente;

    try {
        const result = await sequelize.query(
            'CALL obtenerPedidosActivosCliente(:idCliente)',
            {
                replacements: { idCliente },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.json(result);
    } catch (error) {
        console.error("Error al obtener los pedidos activos del cliente:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos activos del cliente', error });
    }
};

// Obtener pedidos pasados del cliente
exports.getPedidosPasadosCliente = async (req, res) => {
    const idCliente = req.params.idCliente;

    try {
        const result = await sequelize.query(
            'CALL ObtenerPedidosPasadosCliente(:idCliente)',
            {
                replacements: { idCliente },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.json(result);
    } catch (error) {
        console.error("Error al obtener los pedidos pasados del cliente:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos pasados del cliente', error });
    }
};

// Obtener pedidos activos
exports.getPedidosActivos = async (req, res) => {
    const idLocal = req.params.idLocales;

    // Verifica que el idLocal coincide con el id en el token
    if (idLocal != req.user.id) {
        return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para acceder a este recurso.' });
    }

    try {
        const result = await sequelize.query(
            'CALL ObtenerPedidosActivos(:idLocal)',
            {
                replacements: { idLocal },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.json(result);
    } catch (error) {
        console.error("Error al obtener los pedidos activos:", error);
        res.status(500).json({ message: 'Error al obtener los pedidos activos', error });
    }
};

// Obtener pedidos pasados
exports.getPedidosPasados = async (req, res) => {
    const idLocal = req.params.idLocales;

    try {
        const pedidosPasados = await sequelize.query('CALL obtenerPedidosPasados(:idLocal)', {
            replacements: { idLocal },
            type: sequelize.QueryTypes.SELECT
        });

        res.json(pedidosPasados[0]);
    } catch (err) {
        console.error('Error al obtener los pedidos pasados:', err);
        res.status(500).json({ message: 'Error al obtener los pedidos pasados', error: err.message });
    }
};

// Actualizar el estado del pedido
exports.updatePedidoStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { idPedido } = req.params;
    try {
        const [result] = await sequelize.query(
            'CALL actualizarEstadoPedidos(:idPedido)',
            {
                replacements: { idPedido }
            }
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el estado del pack:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del pack', error: error.message });
    }
};

// Obtener un pedido específico
exports.getPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findOne({ where: { id: req.params.idPedido } });
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'No hay pedido' });
    }
};

// Crear un nuevo pedido
exports.createPedido = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        fechaInicio,
        fechaFin,
        horaRecogidaDesde,
        horaRecogidaHasta,
        horaRetiro = '14:00',
        estado = 1,
        idPacks,
        idClientes
    } = req.body;

    try {
        let codigo;
        let codigoExiste = true;

        while (codigoExiste) {
            codigo = generateUniqueCode();
            const pedidoExistente = await Pedido.findOne({ where: { codigo } });
            if (!pedidoExistente) {
                codigoExiste = false;
            }
        }

        const nuevoPedido = await Pedido.create({
            codigo,
            fechaInicio,
            fechaFin,
            horaRecogidaDesde,
            horaRecogidaHasta,
            horaRetiro,
            estado,
            idPacks,
            idClientes
        });

        res.json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
};
