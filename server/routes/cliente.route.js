const ClienteController = require('../controllers/cliente.controller');

module.exports = function(app){
    app.post('/clientes',ClienteController.createCliente);
    app.get('/clientes/:idCliente',ClienteController.getCliente);
}