const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no válido.' });
  }

  try {
    const decoded = jwt.verify(token, 'tuSecretoJWT'); // Reemplaza 'tuSecretoJWT' por tu clave secreta
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = authMiddleware;
