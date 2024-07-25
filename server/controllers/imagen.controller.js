const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'mediafiles/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.uploadImages = upload.fields([{ name: 'logo' }, { name: 'portada' }]);

exports.getImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, '../mediafiles', filename);

        fs.access(filepath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ message: 'Archivo no encontrado' });
            }

            res.sendFile(filepath);
        });
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).json({ message: 'Error al obtener la imagen', error: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, '../mediafiles', filename);

        fs.unlink(filepath, (err) => {
            if (err) {
                return res.status(404).json({ message: 'Archivo no encontrado' });
            }

            res.json({ message: 'Archivo eliminado exitosamente' });
        });
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ message: 'Error al eliminar la imagen', error: error.message });
    }
};
