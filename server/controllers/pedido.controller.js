const { validationResult } = require('express-validator');
const sequelize = require('../config/sequelize.config');
const Pedido = require('../models/pedido.model');

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