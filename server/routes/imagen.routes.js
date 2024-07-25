const ImageController = require('../controllers/imagen.controller');

module.exports = function(app){
    app.post('/uploadImage', ImageController.uploadImage, (req, res) => {
        res.json({ imageUrl: `/mediafiles/${req.file.filename}` });
    });

    app.post('/uploadImages', ImageController.uploadImages, (req, res) => {
        res.json({
            logoUrl: req.files.logo ? `/mediafiles/${req.files.logo[0].filename}` : undefined,
            portadaUrl: req.files.portada ? `/mediafiles/${req.files.portada[0].filename}` : undefined
        });
    });

    app.get('/images/:filename', ImageController.getImage);

    app.delete('/images/:filename', ImageController.deleteImage);
};
