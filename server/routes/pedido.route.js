const PedidoController = require('../controllers/pedido.controller');
module.exports = function(app){
    app.get('/pedidosActivos/:idLocales', PedidoController.getPedidosActivos);
    app.get('/pedidosPasados/:idLocales',PedidoController.getPedidosPasados);
    app.put('/pedidoEstado/:idPedido',PedidoController.updatePedidoStatus);
    app.post('/pedidos',PedidoController.createPedido);
    app.get('/pedidos/:idPedido',PedidoController.getPedido);
}
