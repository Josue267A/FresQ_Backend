const CategoriaController = require('../controllers/categoria.controller')

module.exports = function(app){
    //app.post('/registroLocal',LocalController.createLocal);
    //app.get('/categorias',CategoriaController.getCategorias);
    app.get('/categoria',CategoriaController.getCategoriaById);
    app.get('/categorias',CategoriaController.getCategorias);
    //app.put('/gestionLocal/:id',LocalController.updateLocal);

}