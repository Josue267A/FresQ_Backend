const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');
const pack = require('../models/pack.model');

const reseña = sequelize.define('reseña',{
    comentario : {
        type : DataTypes.STRING,
        allowNull : false
    },
    puntuacion : {
        type : DataTypes.INTEGER(1,5)
    }
});
reseña.belongsTo(pack,{foreignKey:'id_pack',onDelete:'CASCADE'});

module.exports = reseña;
