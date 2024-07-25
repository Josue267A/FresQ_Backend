const LocalController = require('../controllers/local.controller');

module.exports = function(app){
    app.post('/registroLocal', LocalController.createLocal);
    app.get('/local/:id', LocalController.getLocalById);
    app.put('/local/:id', LocalController.uploadImages, LocalController.updateLocal);
    app.post('/login', LocalController.login);
};
