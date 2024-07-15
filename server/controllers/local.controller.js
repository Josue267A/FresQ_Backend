const { validationResult } = require('express-validator');
const Local = require('../models/local.model');
const Categoria = require('../models/categoria.model');
const Pack = require('../models/pack.model');

// Obtener todos los locales
exports.getLocales = async (req, res) => {
    try {
        const locales = await Local.findAll({
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Pack, as: 'packs' }
            ]
        });
        res.json(locales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los locales', error });
    }
};

// Obtener un local por ID
exports.getLocalById = async (req, res) => {
    try {
        const local = await Local.findByPk(req.params.id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Pack, as: 'packs' }
            ]
        });
        if (!local) {
            return res.status(404).json({ message: 'Local no encontrado' });
        }
        res.json(local);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el local', error });
    }
};

// Registrar un nuevo local
exports.createLocal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoLocal = await Local.create(req.body);
        res.status(201).json(nuevoLocal);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el local', error });
    }
};

// Editar un local existente
exports.updateLocal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const local = await Local.findByPk(req.params.id);
        if (!local) {
            return res.status(404).json({ message: 'Local no encontrado' });
        }

        await local.update(req.body);
        res.json(local);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el local', error });
    }
};
