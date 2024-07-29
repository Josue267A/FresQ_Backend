const ClienteController = require('../controllers/cliente.controller');
const LoginController = require('../controllers/login.controller');
const authMiddleware = require('../middleware/iniciosesion.middleware'); // Asegúrate de que la ruta sea correcta

module.exports = function(app) {
    app.post('/clientes/login', LoginController.login);
    app.post('/cliente', ClienteController.createCliente);
    app.get('/clientes/', ClienteController.getClientes);
    app.get('/clientes/:idCliente', authMiddleware, ClienteController.getCliente); // Ruta protegida
};
