const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');

const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];

// Función auxiliar para limpiar la imagen si Multer la guardó pero falló una validación
const borrarImagenProducto = (file) => {
    if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
};

const validateProduct = [
    body('name')
        .notEmpty().withMessage('Tenés que ingresar el nombre del producto').bail()
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),

    body('category')
        .notEmpty().withMessage('Tenés que seleccionar una categoría'),

    body('price')
        .notEmpty().withMessage('Tenés que ingresar el precio del producto').bail()
        .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número mayor a 0'),

    body('description')
        .notEmpty().withMessage('Tenés que ingresar una descripción').bail()
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres'),

    body('image')
        .custom((value, { req }) => {
            if (req.file) {
                const ext = path.extname(req.file.originalname).toLowerCase();
                if (!extensionesPermitidas.includes(ext)) {
                    borrarImagenProducto(req.file);
                    throw new Error('Formato inválido. Solo se permiten JPG, JPEG, PNG o GIF');
                }
            }
            return true;
        })
];

module.exports = {
    validateProduct,
    borrarImagenProducto
};