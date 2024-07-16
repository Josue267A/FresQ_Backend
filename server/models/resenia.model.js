const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Resenia = sequelize.define('resenia',{
    comentario : {
        type : DataTypes.STRING,
        allowNull : false
    },
    puntuacion : {
        type : DataTypes.INTEGER(1,5)
    }
});
resenia.belongsTo(pack,{foreignKey:'id_pack',onDelete:'CASCADE'});

module.exports = Resenia;
