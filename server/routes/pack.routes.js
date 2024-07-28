const PackController = require('../controllers/pack.controller');
const authMiddleware = require('../middleware/iniciosesion.middleware');

module.exports = function(app){
    app.get('/local/:idLocales/packs', authMiddleware, PackController.getPacks);
    app.post('/packs/new', authMiddleware, PackController.createPack);
    app.put('/pack/:id', authMiddleware, PackController.updatePack);
    app.put('/pack/:id/status', authMiddleware, PackController.updatePackStatus);
    app.delete('/pack/:id', authMiddleware, PackController.deletePack);
    app.get('/packs/:id', authMiddleware, PackController.getPackById);
    app.get('/packs', authMiddleware, PackController.getAllPacks);
};
