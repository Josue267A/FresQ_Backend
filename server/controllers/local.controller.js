const { validationResult } = require('express-validator');
const sequelize = require('../config/sequelize.config');
const Local = require('../models/local.model');
const multer = require('multer');
const path = require('path');

const DEFAULT_LOGO = 'logoDefault.jpg';
const DEFAULT_PORTADA = 'portadaDefault.jpg';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../mediafiles'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

exports.uploadImages = upload.fields([{ name: 'logo' }, { name: 'portada' }]);

exports.updateLocal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let {
        numeroCedula,
        nombreLocal,
        ruc,
        correoElectronico,
        contrasenia,
        numeroTelefono,
        latitud,
        longitud,
        idCategorias
    } = req.body;

    let logo = req.files.logo ? `${req.files.logo[0].filename}` : undefined;
    let portada = req.files.portada ? `${req.files.portada[0].filename}` : undefined;

    try {
        const replacements = {
            id: req.params.id,
            numeroCedula,
            nombreLocal,
            ruc,
            correoElectronico,
            contrasenia,
            numeroTelefono,
            latitud,
            longitud,
            idCategorias,
            logo,
            portada
        };

        const updateQuery = `
            CALL editarLocales(:id, :numeroCedula, :nombreLocal, :ruc, :correoElectronico, :contrasenia, :numeroTelefono, :latitud, :longitud, 
                ${logo ? ':logo' : 'NULL'}, ${portada ? ':portada' : 'NULL'}, :idCategorias)`;

        const [result] = await sequelize.query(updateQuery, { replacements });

        if (!result || result.length === 0) {
            return res.status(500).json({ message: 'Error al actualizar el local. La respuesta del procedimiento almacenado está vacía.' });
        }

        res.json({ message: result[0]?.mensaje || 'Local actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el local:', error);
        res.status(500).json({ message: 'Error al actualizar el local', error: error.message });
    }
};

// Registrar un nuevo local
exports.createLocal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let {
        numeroCedula,
        nombreLocal,
        ruc,
        correoElectronico,
        contrasenia,
        numeroTelefono,
        latitud,
        longitud,
        logo,
        portada,
        idCategorias
    } = req.body;

    // Asignar imágenes por defecto si no se proporcionan
    logo = logo || DEFAULT_LOGO;
    portada = portada || DEFAULT_PORTADA;

    try {
        // Ejecutar el procedimiento almacenado
        const [results] = await sequelize.query(
            `CALL crearLocales(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [numeroCedula, nombreLocal, ruc, correoElectronico, contrasenia, numeroTelefono, latitud, longitud, logo, portada, idCategorias],
                type: sequelize.QueryTypes.RAW
            }
        );

        // Responder con éxito si se crea el local
        res.status(201).json({ message: 'Local creado exitosamente', results });
    } catch (error) {
        console.error('Error al crear el local:', error);
        res.status(500).json({ message: 'Error al crear el local', error: error.message });
    }
};

// Obtener todos los locales
module.exports.getLocales = async (_, response) => {
    try {
        const locales = await Local.findAll();
        response.json(locales);
    } catch (error) {
        response.status(500).json({ message: 'Error al obtener los locales', error });
    }
};

// Obtener un local por ID
exports.getLocalById = async (req, res) => {
    try {
        // Llamada al procedimiento almacenado para obtener los datos del local
        const [results] = await sequelize.query(
            `CALL obtenerLocales(:id)`,
            {
                replacements: { id: req.params.id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Local no encontrado' });
        }

        // Obtener el local desde los resultados
        const local = results[0];

        // Devolver la respuesta incluyendo el ID del local y el ID de la categoría
        res.json(local);
    } catch (error) {
        console.error('Error al obtener el local:', error);
        res.status(500).json({ message: 'Error al obtener el local', error: error.message });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { correoElectronico, contrasenia } = req.body;

    try {
        // Busca el local por correo electrónico
        const local = await Local.findOne({ where: { correoElectronico } });
        if (!local) {
            return res.status(404).json({ message: 'Local no encontrado.' });
        }

        // Verifica la contraseña
        const isMatch = await bcrypt.compare(contrasenia, local.contrasenia);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas.' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { id: local.id, nombreLocal: local.nombreLocal }, // Incluye más datos si lo necesitas
            'tuSecretoJWT', // Reemplaza 'tuSecretoJWT' por tu clave secreta
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};
