const express = require('express');
const router = express.Router();

// Importamos el controlador que creaste recién
const mainController = require('../controllers/mainController');

// Definimos todas las rutas y le decimos qué método del controlador usar
router.get('/', mainController.home);
router.get('/detalle', mainController.detalle);
router.get('/carrito', mainController.carrito);
router.get('/login', mainController.login);
router.get('/productos/crear', mainController.crearProducto);
router.get('/productos/editar', mainController.editarProducto);

module.exports = router;