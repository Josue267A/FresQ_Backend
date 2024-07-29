const { validationResult } = require('express-validator');
const Cliente = require('../models/cliente.model');

exports.createCliente = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, edad, sexo, correo, contrasenia, telefono, latitud, longitud, numPacksSalvadas } = req.body;

    try {
        const cliente = await Cliente.create({ 
            nombre, 
            edad, 
            sexo, 
            correo, 
            contrasenia, // Pasar la contraseña en texto plano
            telefono, 
            latitud, 
            longitud, 
            numPacksSalvadas 
        });
        res.json(cliente);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'No se pudo crear cliente', error: error.message });
    }
};

exports.getCliente = async (req, res) => {
    if (req.user.id !== parseInt(req.params.idCliente, 10)) {
      return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para acceder a este recurso.' });
    }
  
    try {
      const cliente = await Cliente.findOne({ where: { id: req.params.idCliente } });
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
    }
  };
// Controlador para el inicio de sesión del cliente
exports.loginCliente = async (req, res) => {
    const { correo, contrasenia } = req.body;

    try {
        const cliente = await Cliente.findOne({ where: { correo } });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Cifrar la contraseña ingresada para compararla
        const hashedPassword = crypto.createHash('md5').update(contrasenia).digest('hex');

        if (cliente.contrasenia !== hashedPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: cliente.id, role: 'cliente' }, 'tuSecretoJWT', { expiresIn: '1h' });

        res.json({ token, cliente });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Controlador para obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
    }
};
