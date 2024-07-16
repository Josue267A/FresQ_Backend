const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const local = require('../models/local.model')

const categoria = sequelize.define('categoria',{

    nombre : {
        type : DataTypes.STRING(100),
        allowNull : false
    }
    
});
//relacion de uno a muchos con local 
//categoria.belongsTo(local);
categoria.hasMany(local,{foreignKey: 'idCatego'});
local.belongsTo(categoria);
module.exports = categoria;