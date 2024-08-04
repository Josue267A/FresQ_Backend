const PedidoController = require('../controllers/pedido.controller');
const authMiddleware = require('../middleware/iniciosesion.middleware');

module.exports = function(app){
    app.get('/pedidosActivos/:idLocales', authMiddleware, PedidoController.getPedidosActivos);
    app.get('/pedidosPasados/:idLocales', authMiddleware, PedidoController.getPedidosPasados);
    app.put('/pedidoEstado/:idPedido', authMiddleware, PedidoController.updatePedidoStatus);
    app.post('/pedidos', authMiddleware, PedidoController.createPedido);
    app.get('/pedidos/:idPedido', authMiddleware, PedidoController.getPedido);
    // Nuevas rutas para pedidos activos y pasados de cliente
    app.get('/pedidosActivosCliente/:idCliente', authMiddleware, PedidoController.getPedidosActivosCliente);
    app.get('/pedidosPasadosCliente/:idCliente', authMiddleware, PedidoController.getPedidosPasadosCliente);
}
