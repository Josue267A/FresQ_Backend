const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const pack = sequelize.define('pack',{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull : {msg:"nombre es requerido"}
        }
    },
    fechaCreacion:{
        type: DataTypes.DATE,
        allowNull : false,
        validate: {
            notNull :{msg : "la fecha de creacion es requerido"}
        }
    },
    precio : {
        type: DataTypes.DECIMAL,
        allowNull :{
            notNull : {msg : "el precio es requerido"}
        }
    },
    descripcion : {
        type: DataTypes.STRING,
        allowNull : false,
        validate: { 
            notNull : {msg : "la descripcion es requerido"}
        }
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull : false,
        validate: {
            notNull : {msg : "la hora de inicio es requerido"}
        }
    },
    horaFin: {
        type : DataTypes.TIME,
        allowNull : false,
        validate: {
            notNull : {msg : "la hora de fin es requerido"}
        }
    },
    multipleDays: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    days: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate :{
            notNull : {msg : "la fecha de inicio es requerido"}
        }
    },
    idLocal : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            notNull : {msg : "El local es requerido"}
        }
    },
    activo : {
        type : DataTypes.BOOLEAN,
        defaultValue: true
    }
});
module.exports = pack;