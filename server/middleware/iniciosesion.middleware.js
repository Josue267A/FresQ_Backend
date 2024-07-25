const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, 'tuSecretoJWT'); // Reemplaza 'tuSecretoJWT' por tu clave secreta
    req.local = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = authMiddleware;
