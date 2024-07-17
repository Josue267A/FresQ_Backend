const LocalController = require('../controllers/local.controller')

module.exports = function(app){
    app.post('/registroLocal',LocalController.createLocal);
    //app.get('/local/:id',LocalController.getLocalById);
    //app.get('/locales',LocalController.getLocales);
    
    //app.put('/gestionLocal/:id',LocalController.updateLocal);
}