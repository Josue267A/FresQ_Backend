const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const cliente = sequelize.define('cliente',{
    nombre: {
        type: DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull : {msg : "El nombre es requerido"}
        }
    },
    correo : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull :{msg : "El correo electronico es requerido"},
            isEmail :{
                args : true,
                msg : "El correo electronico no es valido"
            },
            containsAtSymbolAndDot(value){
                if(!/^[^@]+@[^@]+\.[^@]+$/.test(value)){
                    throw new Error('El correo electrónico debe contener "@" y un punto.');
                }
            }
        }
    },
    telefono : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull : {msg : "El numero de telefono es requerido"},
            isNumeric : {
                msg : "El numero de telefono debe ser numerico",
                args : true
            },
            len:{ 
                args : [7,9],
                msg : "El número telefónico debe tener entre 7 y 9 caracteres"
            }
        }
    },
    contraseña : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La contraseña es requerida" },
            len: {
                args: [8, 100],
                msg: "La contraseña debe tener al menos 8 caracteres"
            },
            isStrongPassword(value) {
                const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!strongPasswordRegex.test(value)) {
                    throw new Error('La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial');
                }
            }
        }
    },
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
    },
    latitud : {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
            notNull: { msg: "La latitud es requerida" },
            isDecimal: {
                args: true,
                msg: "La latitud debe ser un valor decimal"
            },
            min: {
                args: [-90],
                msg: "La latitud debe ser mayor o igual a -90"
            },
            max: {
                args: [90],
                msg: "La latitud debe ser menor o igual a 90"
            }
        }
    },
    longitud : {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
            notNull: { msg: "La longitud es requerida" },
            isDecimal: {
                args: true,
                msg: "La longitud debe ser un valor decimal"
            },
            min: {
                args: [-180],
                msg: "La longitud debe ser mayor o igual a -180"
            },
            max: {
                args: [180],
                msg: "La longitud debe ser menor o igual a 180"
            }
        }
    }
})