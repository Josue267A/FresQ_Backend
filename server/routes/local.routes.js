const LocalController = require('../controllers/local.controller');

module.exports = function(app){
    app.post('/registroLocal', LocalController.createLocal);
    app.get('/locales/:id', LocalController.getLocalById);
    app.get('/locales', LocalController.getLocales);
    app.put('/local/:id', LocalController.uploadImages, LocalController.updateLocal);
    app.post('/login', LocalController.login);
};
