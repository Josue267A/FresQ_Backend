const { validationResult } = require('express-validator');
const Pack = require('../models/pack.model');
const Local = require('../models/local.model');
const Reseña = require('../models/resenia.model');
const Pedido = require('../models/pedido.model');
const sequelize = require('../config/sequelize.config');
const { response } = require('express');

// Obtener todos los packs
exports.getAllPacks = async (_, res) => {
    try {
        const packs = await Pack.findAll();
        res.json(packs);
    } catch (error) {
        res.status(500).json({ message: 'No hay registros de packs', error });
    }
};

// Obtener packs por local
exports.getPacks = async (req, res) => {
    const idLocal = req.params.idLocales;

    // Permitir acceso a clientes o verificar que el idLocal coincide con el id del token
    if (req.user.tipo !== 'cliente' && idLocal != req.user.id) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para acceder a estos packs.' });
    }

    try {
        const result = await sequelize.query('CALL ObtenerPacksPorLocal(:idLocal)', {
            replacements: { idLocal },
            type: sequelize.QueryTypes.SELECT
        });
        const packs = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
        res.json(packs);
    } catch (error) {
        console.error("Error al obtener los packs:", error);
        res.status(500).json({ message: 'Error al obtener los packs', error });
    }
};

// Obtener pack por ID
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

// Crear un nuevo pack
exports.createPack = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        nombre,
        precio,
        descripcion,
        horaInicio,
        horaFin,
        fechaInicio,
        fechaFin,
        idLocales,
        activo = 1,
        mostrar = 1,
        multipleDays,
        days = 0
    } = req.body;

    // Verificar que el idLocales coincide con el id del token
    if (idLocales != req.user.id) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para crear un pack para este local.' });
    }

    try {
        const activoVal = activo ? 1 : 0;
        const mostrarVal = mostrar ? 1 : 0;
        const multipleDaysVal = multipleDays ? 1 : 0;
        await sequelize.query(
            'CALL crearPacks(:nombre, :precio, :descripcion, :horaInicio, :horaFin, :fechaInicio, :fechaFin, :idLocales, :activo, :mostrar, :multipleDays, :days)',
            {
                replacements: {
                    nombre,
                    precio,
                    descripcion,
                    horaInicio,
                    horaFin,
                    fechaInicio,
                    fechaFin,
                    idLocales,
                    activo: activoVal,
                    mostrar: mostrarVal,
                    multipleDays: multipleDaysVal,
                    days
                }
            }
        );

        res.status(201).json({ message: 'Pack creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el pack:', error);
        res.status(500).json({ message: 'Error al crear el pack', error: error.message });
    }
};

// Editar un pack existente
exports.updatePack = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        nombre,
        precio,
        descripcion,
        horaInicio,
        horaFin,
        fechaInicio,
        fechaFin,
        idLocales,
        activo,
        mostrar,
        multipleDays,
        days
    } = req.body;

    // Verificar que el idLocales coincide con el id del token
    if (idLocales != req.user.id) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para editar un pack para este local.' });
    }

    try {
        const activoVal = activo ? 1 : 0;
        const mostrarVal = mostrar ? 1 : 0;
        const multipleDaysVal = multipleDays ? 1 : 0;
        const packUpdate = await sequelize.query(
            'CALL editarPacks(:idPacks, :nombre, :precio, :descripcion, :horaInicio, :horaFin, :fechaInicio, :fechaFin, :idLocales, :activo, :mostrar, :multipleDays, :days)',
            {
                replacements: {
                    idPacks: req.params.id,
                    nombre,
                    precio,
                    descripcion,
                    horaInicio,
                    horaFin,
                    fechaInicio,
                    fechaFin,
                    idLocales,
                    activo: activoVal,
                    mostrar: mostrarVal,
                    multipleDays: multipleDaysVal,
                    days
                }
            }
        );
        res.json(packUpdate);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pack', error: error.message });
    }
};

// Actualizar estado de un pack
exports.updatePackStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    try {
        // Verificar que el pack pertenece al local del token
        const pack = await sequelize.query('SELECT idLocales FROM packs WHERE id = :idPacks', {
            replacements: { idPacks: id },
            type: sequelize.QueryTypes.SELECT
        });

        if (pack.length === 0 || pack[0].idLocales != req.user.id) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para actualizar el estado de este pack.' });
        }

        const [result] = await sequelize.query(
            'CALL actualizarEstadoPacks(:idPacks)',
            {
                replacements: { idPacks: id }
            }
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el estado del pack:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del pack', error: error.message });
    }
};


// Eliminar un pack
exports.deletePack = async (req, res) => {
    try {
        const pack = await Pack.findOne({ where: { id: req.params.id } });
        if (!pack) {
            return res.status(404).json({ message: "Pack no encontrado" });
        }

        // Verificar que el idLocales coincide con el id del token
        if (pack.idLocales != req.user.id) {
            return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para eliminar este pack.' });
        }

        pack.mostrar = 0;
        await pack.save();
        res.json(pack);
    } catch (err) {
        res.status(500).json({ message: 'No se pudo eliminar el pack', err: err.message });
    }
};

// Obtener pack por ID
exports.getPackById = async (req, res) => {
    try {
        const pack = await Pack.findOne({ where: { id: req.params.id } });
        res.json(pack);
    } catch (err) {
        res.status(500).json({ message: "No se encontró el pack", error: err.message });
    }
};
