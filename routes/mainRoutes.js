const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Importamos el controlador principal
const mainController = require('../controllers/mainController');

// --- CONFIGURACIÓN DE MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Le decimos que guarde las imágenes en la carpeta public/images
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        // Le damos un nombre único a la imagen (ej: remera-163456789.jpg) para que no se pisen
        const newFilename = 'remera-' + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});
const upload = multer({ storage });
// -------------------------------

// Definimos todas las rutas y le decimos qué método del controlador usar
router.get('/', mainController.home);
router.get('/detalle/:id', mainController.detalle);
router.get('/login', mainController.login);

// Rutas del carrito de compras
router.get('/carrito', mainController.carrito);
router.post('/carrito/agregar/:id', mainController.agregarAlCarrito);
router.post('/carrito/actualizar/:index', mainController.actualizarCarrito);
router.post('/carrito/eliminar/:index', mainController.eliminarDelCarrito);
router.post('/carrito/finalizar', mainController.finalizarCompra);

// Rutas de productos
router.get('/productos/crear', mainController.crearProducto);

// upload.single('image') ataja la foto antes de ir al controlador
router.post('/productos', upload.single('image'), mainController.guardarProducto);

// Ruta para mostrar el formulario de edición
router.get('/productos/editar/:id', mainController.editarProducto);

// Ruta para PROCESAR el formulario y guardar los cambios (PUT)
router.put('/productos/editar/:id', upload.single('image'), mainController.actualizarProducto);

// ==========================================
// ¡ACÁ ESTÁ LA NUEVA RUTA PARA BORRAR!
// ==========================================
router.delete('/productos/borrar/:id', mainController.borrarProducto);

module.exports = router;