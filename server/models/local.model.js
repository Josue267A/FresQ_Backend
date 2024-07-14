const {DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize.config');

const local = sequelize.define('local',{
    correoElectronico : {
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
    nombreLocal : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull :{msg : "El nombre del local es requerido"}
        }
    },
    numeroTelefono : {
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
    numeroCedula : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notNull : {msg : "El numero de cedula es requerido"},
            isNumeric : {
                msg : "El numero de cedula debe ser numerico",
                args : true
            },
            len:{ 
                args : [10],
                msg : "El número telefónico debe tener 10 caracteres"
            }
        }
    },
    contrasenia : {
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
    ruc : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El RUC es requerido" },
            isNumeric: {
                args: true,
                msg: "El RUC solo debe contener números"
            },
            len: {
                args: [13, 13],
                msg: "El RUC debe tener exactamente 13 caracteres"
            }
        }
    }

});
module.exports = local;