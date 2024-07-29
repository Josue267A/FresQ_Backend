const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Local = require('../models/local.model'); // Modelo del Local
const Cliente = require('../models/cliente.model'); // Modelo del Cliente
const md5 = require('md5'); // Asegúrate de tener md5 instalado

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { correoElectronico, contrasenia } = req.body;

    try {
        // Busca el local por correo electrónico
        let usuario = await Local.findOne({ where: { correoElectronico } });
        let tipoUsuario = 'local';

        // Si no encuentra el local, busca en clientes
        if (!usuario) {
            usuario = await Cliente.findOne({ where: { correo: correoElectronico } }); // Ajustar el campo de correo
            tipoUsuario = 'cliente';
        }

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verifica la contraseña
        const hashedPassword = md5(contrasenia);
        if (usuario.contrasenia !== hashedPassword) {
            return res.status(400).json({ message: 'Credenciales incorrectas.' });
        }

        // Genera el token JWT
        const token = jwt.sign(
            { id: usuario.id, tipo: tipoUsuario }, // Incluye más datos si lo necesitas
            'tuSecretoJWT', // Reemplaza 'tuSecretoJWT' por tu clave secreta
            { expiresIn: '1h' }
        );

        return res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};
