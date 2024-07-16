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
