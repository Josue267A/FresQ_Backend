const LocalController = require('../controllers/local.controller');
const authMiddleware = require('../middleware/iniciosesion.middleware'); // Asegúrate de que la ruta sea correcta
const LoginController = require('../controllers/login.controller');

module.exports = function(app){
    app.post('/registroLocal', LocalController.createLocal);
    app.get('/locales/:id', authMiddleware, LocalController.getLocalById); // Ruta protegida
    app.get('/locales', LocalController.getLocales); 
    app.put('/local/:id', authMiddleware, LocalController.uploadImages, LocalController.updateLocal); // Ruta protegida
    app.post('/login', LoginController.login);
};
