const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const usersController = require('../controllers/usersController');

// Middlewares de control de acceso
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Acá me configuro Multer para atajar las fotos de perfil y mandarlas a la carpeta correcta
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/users'));
    },
    filename: (req, file, cb) => {
        const newFilename = 'avatar-' + Date.now() + path.extname(file.originalname);
        cb(null, newFilename);
    }
});
const upload = multer({ storage });

// Mis rutas para el Registro (solo visitantes sin sesión)
router.get('/registro', guestMiddleware, usersController.register);
// Atrapo el POST del registro y le paso el middleware de multer para que suba la imagen
router.post('/registro', upload.single('avatar'), usersController.processRegister);

// Mis rutas para el Login (solo visitantes sin sesión)
router.get('/login', guestMiddleware, usersController.login);
// Ruta para procesar los datos que me llegan del formulario de login por POST
router.post('/login', usersController.processLogin);

// Mis rutas para ver mi perfil (solo usuarios logueados) y para cerrar la sesión
router.get('/perfil', authMiddleware, usersController.profile);
router.get('/logout', usersController.logout);

module.exports = router;