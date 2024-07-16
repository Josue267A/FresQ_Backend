const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Local = require('./local.model');

const Categoria = sequelize.define('categoria', {
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
});

module.exports = Categoria;
