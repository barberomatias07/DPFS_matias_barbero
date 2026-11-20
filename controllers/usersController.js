const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');
const { borrarArchivoSubido } = require('../middlewares/userValidations');

const usersController = {
    register: (req, res) => {
        res.render('users/register');
    },
    
    processRegister: async (req, res) => {
        try {
            const errors = validationResult(req);

            // Si hubo errores de validación, borramos la foto (si subió una) y volvemos al formulario
            if (!errors.isEmpty()) {
                borrarArchivoSubido(req.file);
                return res.render('users/register', {
                    errors: errors.mapped(),
                    oldData: req.body
                });
            }

            await db.User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                avatar: req.file ? req.file.filename : 'avatar-default.png',
                roleId: 2
            });

            return res.redirect('/usuarios/login');
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            return res.status(500).send('No se pudo completar el registro');
        }
    },

    login: (req, res) => {
        res.render('users/login');
    },

    processLogin: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render('users/login', {
                    errors: errors.mapped(),
                    oldData: req.body
                });
            }

            const userFound = await db.User.findOne({
                where: { email: req.body.email },
                include: ['role']
            });

            if (userFound) {
                const passwordOk = bcrypt.compareSync(req.body.password, userFound.password);
                
                if (passwordOk) {
                    const userToLogin = userFound.toJSON();
                    delete userToLogin.password;
                    
                    req.session.userLogged = userToLogin;

                    if (req.body.remember) {
                        res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60 * 60 * 24 * 365) });
                    }

                    return res.redirect('/usuarios/perfil');
                }
            }
            
            // Si el email no existe o la clave no coincide
            return res.render('users/login', {
                errors: {
                    email: { msg: 'Las credenciales ingresadas no son válidas' }
                },
                oldData: req.body
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return res.render('users/login');
        }
    },

    profile: (req, res) => {
        res.render('users/profile', { user: req.session.userLogged });
    },

    logout: (req, res) => {
        res.clearCookie('userEmail');
        req.session.destroy();
        return res.redirect('/');
    }
};

module.exports = usersController;