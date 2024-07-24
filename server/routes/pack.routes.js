const PackController = require('../controllers/pack.controller');
module.exports = function(app){
    app.get('/local/:idLocales/packs',PackController.getPacks);
    app.post('/packs/new',PackController.createPack);
    app.put('/pack/:id',PackController.updatePack);
    app.put('/pack/:id/status',PackController.updatePackStatus);
    app.delete('/pack/:id',PackController.deletePack);
    app.get('/local/packs/:id',PackController.getPackById);
}