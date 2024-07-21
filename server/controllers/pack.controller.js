const { validationResult } = require('express-validator');
const Pack = require('../models/pack.model');
const Local = require('../models/local.model');
const Reseña = require('../models/resenia.model');
const Pedido = require('../models/pedido.model');
const sequelize = require('../config/sequelize.config');

// Obtener todos los packs
exports.getPacks = async (req, res) => {
    const idLocal = req.params.idLocales;
    try {
        const packs = await sequelize.query('CALL ObtenerPacksPorLocal(:idLocal)',{replacements:{idLocal},
        type : sequelize.QueryTypes.SELECT
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
    //se  obtiene los datos del body que se vana ingresar
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
    try {
        // Convertir valores booleanos a 0 o 1
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
                    activo : activoVal,
                    mostrar : mostrarVal,
                    multipleDays:multipleDaysVal,
                    days
                }
            }
        );
        
        res.status(201).json({message:'Pack creado exitosamente'});
    } catch (error) {
        console.error('Error al crear el pack:', error); // Esto imprimirá el error en la consola para depuración
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
    try {
        // Convertir valores booleanos a 0 o 1
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
        //res.status(200).json({ message: 'Pack actualizado exitosamente' });
        res.json(packUpdate);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pack', error });
    }
};
// actualizar estado
exports.updatePackStatus = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {id} = req.params;
    try {
        const[result] = await sequelize.query(
            'CALL actualizarEstadoPacks(:idPacks)',
            {
                replacements: { idPacks: id }
            }
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el estado del pack:', error); // Esto imprimirá el error en la consola para depuración
        res.status(500).json({ message: 'Error al actualizar el estado del pack', error: error.message });
    }
};
//eliminar pack
exports.deletePack = async (req,res) =>  {
    try{
        const pack = await Pack.findOne({where:{id:req.params.id}});
        if(!pack){
            return res.status(404).json({message:"pack no encontrado"})
        }
        await Pack.destroy({where:{id:req.params.id}});
        res.json(pack)
    }catch(err){
        res.status(500).json({message:'no vale elminar'})
    }
}