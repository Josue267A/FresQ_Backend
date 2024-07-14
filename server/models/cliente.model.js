const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const cliente = sequelize.define('cliente',{
    genero : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate :{
            notNull : {msg : "el genero es requerido"}
        }
    },
    edad : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate :{ 
            notNull : {msg : "la edad es requerido"}
        }
    }
})