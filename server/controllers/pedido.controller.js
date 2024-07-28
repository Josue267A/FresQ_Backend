const { validationResult } = require('express-validator');
const sequelize = require('../config/sequelize.config');
const Pedido = require('../models/pedido.model');
// funcion para crear el codigo

function generateUniqueCode() {
    return (
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
        String.fromCharCode(48 + Math.floor(Math.random() * 10)) +
        String.fromCharCode(48 + Math.floor(Math.random() * 10))
    );
}
exports.getPedidosActivos = async (req,res) => {
    const idLocal = req.params.idLocales;
    try{
        const pedidosActivos = await sequelize.query('CALL obtenerPedidosActivos(:idLocal)',{ replacements:{idLocal},
            type: sequelize.QueryTypes.SELET
        });
        
        res.json(pedidosActivos);
    }catch(err){
        console.error('Error al obtener los pedidos activos');
        res.status(500).json({message:'Error al obtneer los pedidos activos',error:error.message});
    }
};

exports.getPedidosPasados = async(req,res) => {
    const idLocal = req.params.idLocales;
    try{
        const pedidosActivos = await sequelize.query('CALL obtenerPedidosPasados(:idLocal)',{ replacements:{idLocal},
            type: sequelize.QueryTypes.SELET
        });
        
        res.json(pedidosActivos);
    }catch(err){
        console.error('Error al obtener los pedidos activos');
        res.status(500).json({message:'Error al obtneer los pedidos activos',error:error.message});
    }
}
exports.updatePedidoStatus = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {idPedido} = req.params;
    try {
        const [result] = await sequelize.query(
            'CALL actualizarEstadoPedidos(:idPedido)',
            {
                replacements:{idPedido:idPedido}
            }
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el estado del pack:', error); // Esto imprimirá el error en la consola para depuración
        res.status(500).json({ message: 'Error al actualizar el estado del pack', error: error.message });
    }
}
exports.getPedido = async(req,res) => {
    try{
        const pedido = await Pedido.findOne({where:{id:req.params.idPedido}});
        res.json(pedido);
    }catch(error){
        res.status(500).json({message:'No hay pedido'});
    }
}
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

        //res.status(201).json({ message: 'Pedido creado exitosamente', pedido: nuevoPedido });
        res.json(nuevoPedido);
    } catch (error) {
        console.error('Error al crear el pedido:', error); // Esto imprimirá el error en la consola para depuración
        res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
};