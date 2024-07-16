const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
//const Pack = require ('../models/pack.model');
//const Cliente = require ('../models/cliente.model');

const pedido = sequelize.define('pedido',{
    codigo : {
        type : DataTypes.CHAR(5),
        allowNull : false,
        unique : true,
        isNumeric : {
            msg : "El numero de telefono debe ser numerico",
            args : true
        },
    },
    fecha : {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: { msg: "La fecha es requerida" },
            isDate: {
                args: true,
                msg: "La fecha debe ser válida"
            }
        }
    },
    hora_recogida_desde : {
        type: DataTypes.TIME,
        allowNull : false,
        validate : {
            notNull: { msg: "La hora es requerida" },
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: "La hora debe estar en el formato HH:MM"
            }
        }
    },
    hora_recogida_hasta: {
        type: DataTypes.TIME,
        allowNull : false,
        validate : {
            notNull: { msg: "La hora es requerida" },
            is: {
                args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                msg: "La hora debe estar en el formato HH:MM"
            }
        }
    },
    estado : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    },
    

});
// Relación uno a muchos con Pack
/*Pack.hasMany(pedido, {
    foreignKey: {
        name: 'id_pack',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

pedido.belongsTo(Pack, {
    foreignKey: 'id_pack',
    allowNull: false
});

// Relación uno a muchos con Cliente
Cliente.hasMany(pedido, {
    foreignKey: {
        name: 'id_cliente',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

pedido.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
    allowNull: false
});*/
module.exports = pedido;
