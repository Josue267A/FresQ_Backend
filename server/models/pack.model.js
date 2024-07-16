const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');


const Pack = sequelize.define('pack',{
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
    
    estado : {
        type : DataTypes.BOOLEAN,
        defaultValue: true
    },
    mostrar : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
});
pack.belongsTo(local,{foreignKey: 'idLocal', onDelete :'CASCADE'});
// relacion de uno a muchos con resena
pack.hasMany(reseña,{foreignKey: 'id_pack',onDelete : 'CASCADE'});
// Relación uno a muchos con Pedido
pack.hasMany(Pedido, {
    foreignKey: {
        name: 'id_pack',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
module.exports = pack;