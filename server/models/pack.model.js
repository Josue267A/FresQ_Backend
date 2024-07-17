const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
//const local = require('../models/local.model');
const reseña = require('./resenia.model');
const pedido = require('../models/pedido.model');

const pack = sequelize.define('pack',{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull : {msg:"nombre es requerido"}
        }
    },
    fechaCreacion:{
        type: DataTypes.DATEONLY,
        allowNull : false,
        validate: {
            notNull :{msg : "La fecha de creacion es requerido"},
            isDate: {
                args: true,
                msg: "La fecha debe ser válida"
            }
        }
    },
    precio : {
        type: DataTypes.DECIMAL(18,2),
        allowNull :{
            notNull : {msg : "El precio es requerido"}
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
            notNull : {msg : "la hora de inicio es requerido"},
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: "La hora debe estar en el formato HH:MM"
            }
        }
    },
    horaFin: {
        type : DataTypes.TIME,
        allowNull : false,
        validate: {
            notNull : {msg : "la hora de fin es requerido"},
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: "La hora debe estar en el formato HH:MM"
            }
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
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate :{
            notNull : {msg : "la fecha de inicio es requerido"},
            isDate: {
                args: true,
                msg: "La fecha debe ser válida"
            }
            
        }
    },
    //id_local foreanea
    estado : {
        type : DataTypes.BOOLEAN,
        defaultValue: true
    },
    mostrar : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
},{timestamps: false // Deshabilita la creación automática de createdAt y updatedAt
    
});

pack.hasMany(pedido,{foreignKey:'idPacks'});
pedido.belongsTo(pack,{foreignKey:'idPacks'});

pack.hasMany(reseña,{foreignKey:'idPacks'});
reseña.belongsTo(pack,{foreignKey:'idPacks'});
module.exports = pack;