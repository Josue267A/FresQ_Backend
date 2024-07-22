const { validationResult } = require('express-validator');
const sequelize = require('../config/sequelize.config'); // Ajusta la ruta según tu estructura de proyecto

const Local = require('../models/local.model');
const Categoria = require('../models/categoria.model');
const Pack = require('../models/pack.model');



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
// Registrar un nuevo local
exports.createLocal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
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
// Editar un local existente
exports.updateLocal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
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

    try {
        const result = await sequelize.query(
            `CALL editarLocales(:id, :numeroCedula, :nombreLocal, :ruc, :correoElectronico, :contrasenia, :numeroTelefono, :latitud, :longitud, :logo, :portada, :idCategorias)`,
            {
                replacements: {
                    id: req.params.id,
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
                }
            }
        );

        res.json({ message: result[0].mensaje });
    } catch (error) {
        if (error.original && error.original.sqlState === '45000') {
            res.status(400).json({ message: error.original.sqlMessage });
        } else {
            res.status(500).json({ message: 'Error al actualizar el local', error });
        }
    }
};