const { validationResult } = require('express-validator');
const Pack = require('../models/pack.model');
const Local = require('../models/local.model');
const Reseña = require('../models/resenia.model');
const Pedido = require('../models/pedido.model');

// Obtener todos los packs
exports.getPacks = async (req, res) => {
    try {
        const packs = await Pack.findAll({
            include: [
                { model: Local, as: 'local' },
                { model: Reseña, as: 'resenias' },
                { model: Pedido, as: 'pedidos' }
            ]
        });
        res.json(packs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los packs', error });
    }
};

// Obtener un pack por ID
exports.getPackById = async (req, res) => {
    try {
        const pack = await Pack.findByPk(req.params.id, {
            include: [
                { model: Local, as: 'local' },
                { model: Reseña, as: 'resenias' },
                { model: Pedido, as: 'pedidos' }
            ]
        });
        if (!pack) {
            return res.status(404).json({ message: 'Pack no encontrado' });
        }
        res.json(pack);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pack', error });
    }
};

// Registrar un nuevo pack
exports.createPack = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoPack = await Pack.create(req.body);
        res.status(201).json(nuevoPack);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pack', error });
    }
};

// Editar un pack existente
exports.updatePack = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const pack = await Pack.findByPk(req.params.id);
        if (!pack) {
            return res.status(404).json({ message: 'Pack no encontrado' });
        }

        await pack.update(req.body);
        res.json(pack);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pack', error });
    }
};
