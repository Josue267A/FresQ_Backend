const { response } = require('express');
const { validationResult } = require('express-validator');
const Cliente = require('../models/cliente.model')

exports.createCliente = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const{nombre,edad,sexo,correo,contrasenia,telefono,latitud,longitud,numPacksSalvadas} = req.body;
    try {
        const cliente = await Cliente.create({nombre,edad,sexo,correo,contrasenia,telefono,latitud,longitud,numPacksSalvadas});
        res.json(cliente)
    } catch (error) {
        res.status(500).json({message:'No se pudo crear cliente'})
    }
}
exports.getCliente = async(req,res) => {
    try {
        const cliente = await Cliente.findOne({where:{id:req.params.idCliente}});
        res.json(cliente);
    } catch (error) {
        res.status(500).json({message:'No hay cliente'});
    }
}