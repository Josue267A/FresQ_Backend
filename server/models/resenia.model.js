const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');
//const pack = require('./pack.model');

const resenia = sequelize.define('resenias',{
    comentario : {
        type : DataTypes.STRING,
        allowNull : false
    },
    puntuacion : {
        type : DataTypes.INTEGER(1,5)
    }
},{timestamps: false // Deshabilita la creación automática de createdAt y updatedAt
    
});
//resenia.belongsTo(pack,{foreignKey:'id_pack',onDelete:'CASCADE'});

module.exports = resenia;
