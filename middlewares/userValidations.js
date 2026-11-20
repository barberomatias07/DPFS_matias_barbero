const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const db = require('../database/models');

const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];

// Función auxiliar para limpiar la imagen si Multer la guardó pero falló una validación
const borrarArchivoSubido = (file) => {
    if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
};

const validateRegister = [
    body('fullName')
        .notEmpty().withMessage('Tenés que ingresar tu nombre completo').bail()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('email')
        .notEmpty().withMessage('Tenés que ingresar un correo electrónico').bail()
        .isEmail().withMessage('Ingresá un formato de correo válido').bail()
        .custom(async (value) => {
            const usuarioExistente = await db.User.findOne({ where: { email: value } });
            if (usuarioExistente) {
                throw new Error('Este correo electrónico ya está registrado');
            }
            return true;
        }),

    body('password')
        .notEmpty().withMessage('Tenés que ingresar una contraseña').bail()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

    body('avatar')
        .custom((value, { req }) => {
            if (req.file) {
                const ext = path.extname(req.file.originalname).toLowerCase();
                if (!extensionesPermitidas.includes(ext)) {
                    borrarArchivoSubido(req.file);
                    throw new Error('Formato inválido. Solo se permiten JPG, JPEG, PNG o GIF');
                }
            }
            return true;
        })
];

const validateLogin = [
    body('email')
        .notEmpty().withMessage('Tenés que ingresar tu correo electrónico').bail()
        .isEmail().withMessage('Ingresá un formato de correo válido'),

    body('password')
        .notEmpty().withMessage('Tenés que ingresar tu contraseña')
];

module.exports = {
    validateRegister,
    validateLogin,
    borrarArchivoSubido
};