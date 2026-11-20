const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const usersController = require('../controllers/usersController');

// Middlewares de control de acceso y validaciones
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/userValidations');

// Configuración de Multer para fotos de perfil
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

// Registro
router.get('/registro', guestMiddleware, usersController.register);
router.post('/registro', upload.single('avatar'), validateRegister, usersController.processRegister);

// Login
router.get('/login', guestMiddleware, usersController.login);
router.post('/login', validateLogin, usersController.processLogin);

// Perfil y Logout
router.get('/perfil', authMiddleware, usersController.profile);
router.get('/logout', usersController.logout);

module.exports = router;