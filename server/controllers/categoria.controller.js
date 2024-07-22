//const { validationResult } = require("express-validator");
const categoria = require("../models/categoria.model");

// Controlador para obtener todas las categorías
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías", error });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
      // Llamada al procedimiento almacenado para obtener los datos de la categoría
      const [results] = await sequelize.query(
          `CALL obtenerCategoria(:id)`,
          {
              replacements: { id: req.params.id },
              type: sequelize.QueryTypes.SELECT
          }
      );

      if (results.length === 0) {
          return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      // Obtener la categoría desde los resultados
      const categoria = results[0];

      // Devolver la respuesta
      res.json(categoria);
  } catch (error) {
      console.error('Error al obtener la categoría:', error);
      res.status(500).json({ message: 'Error al obtener la categoría', error: error.message });
  }
};