const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Local = require('./local.model');

const Categoria = sequelize.define('categoria',{

    nombre : {
        type : DataTypes.STRING(100),
        allowNull : false
    }
    
});
//relacion de uno a muchos con local 
Categoria.hasMany(Local,{foreignKey:'idCategorias'});
Local.belongsTo(Categoria);

module.exports = Categoria;