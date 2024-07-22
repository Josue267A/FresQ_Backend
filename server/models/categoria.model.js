const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const local = require('../models/local.model')

const categoria = sequelize.define('categorias',{

    nombre : {
        type : DataTypes.STRING(100),
        allowNull : false
    }
    
},{timestamps: false // Deshabilita la creación automática de createdAt y updatedAt
    
});
//relacion de uno a muchos con local 
//categoria.belongsTo(local);
categoria.hasMany(local,{foreignKey: 'idCategorias'});
local.belongsTo(categoria,{foreignKey:'idCategorias'});
module.exports = categoria;
