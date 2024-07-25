const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const bcrypt = require('bcryptjs');
const pack = require('../models/pack.model');

const DEFAULT_LOGO = 'mediafiles/logodefault.jpg';
const DEFAULT_PORTADA = 'mediafiles/portadadefault.jpg';

const Local = sequelize.define('locale', {
    numeroCedula: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        validate: {
            notNull: { msg: "El numero de cedula es requerido" },
            isNumeric: {
                msg: "El numero de cedula debe ser numerico",
                args: true
            },
            len: {
                args: [10],
                msg: "El número cedula debe tener 10 caracteres"
            }
        }
    },
    nombreLocal: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: { msg: "El nombre del local es requerido" }
        }
    },
    ruc: {
        type: DataTypes.CHAR(13),
        allowNull: false,
        unique: true,
    },
    correoElectronico: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: { msg: "El correo electronico es requerido" },
            isEmail: {
                args: true,
                msg: "El correo electronico no es valido"
            },
            containsAtSymbolAndDot(value) {
                if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
                    throw new Error('El correo electrónico debe contener "@" y un punto.');
                }
            }
        }
    },
    contrasenia: {
        type: DataTypes.TEXT('long'), // Cambia a 100 o más si es necesario
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
    numeroTelefono: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        validate: {
            notNull: { msg: "El numero de telefono es requerido" },
            isNumeric: {
                msg: "El numero de telefono debe ser numerico",
                args: true
            },
            len: {
                args: [7, 10],
                msg: "El número telefónico debe tener entre 7 y 10 caracteres"
            }
        }
    },
    latitud: {
        type: DataTypes.DECIMAL(9, 6),
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
    longitud: {
        type: DataTypes.DECIMAL(9, 6),
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
    },
    logo: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: DEFAULT_LOGO
    },
    portada: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: DEFAULT_PORTADA
    }
}, { timestamps: false });

Local.beforeCreate(async (local) => {
    const salt = await bcrypt.genSalt(10);
    local.contrasenia = await bcrypt.hash(local.contrasenia, salt);
});

Local.hasMany(pack, { foreignKey: 'idLocales' });
pack.belongsTo(Local, { foreignKey: 'idLocales' });

module.exports = Local;