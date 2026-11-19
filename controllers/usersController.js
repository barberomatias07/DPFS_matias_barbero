const bcrypt = require('bcryptjs');
// Me traigo los modelos de Sequelize para consultar la tabla users de MySQL
const db = require('../database/models');

const usersController = {
    // Muestro la vista del formulario de registro
    register: (req, res) => {
        res.render('users/register');
    },
    
    // Acá atrapo el POST del registro, encripto la clave y guardo mi usuario nuevo en la base
    processRegister: async (req, res) => {
        try {
            // Chequeo primero si el email ya está registrado para que MySQL no me tire error de duplicado
            const usuarioExistente = await db.User.findOne({
                where: { email: req.body.email }
            });

            if (usuarioExistente) {
                return res.render('users/register');
            }

            // Creo el registro nuevo en la tabla users (por defecto entra con roleId: 2 que es customer)
            await db.User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                // Le paso el bcrypt para que la contraseña quede encriptada y no se lea cruda en la base
                password: bcrypt.hashSync(req.body.password, 10),
                // Si subí una foto por multer la uso, sino le clavo la imagen por defecto
                avatar: req.file ? req.file.filename : 'default-avatar.png',
                roleId: 2
            });

            // Lo pateo al login para que entre de una con su cuenta recién creada
            return res.redirect('/usuarios/login');
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            return res.status(500).send('No se pudo completar el registro');
        }
    },

    // Muestro la vista del formulario de login
    login: (req, res) => {
        res.render('users/login');
    },

    // Esta función procesa los datos que me llegan por POST desde el formulario de Iniciar Sesión
    processLogin: async (req, res) => {
        try {
            // 1. Busco en la base a ver si encuentro algún usuario con ese email (y me traigo también su rol)
            const userFound = await db.User.findOne({
                where: { email: req.body.email },
                include: ['role']
            });

            if (userFound) {
                // 2. Si el email existe, comparo la contraseña del input con la encriptada de la base
                const passwordOk = bcrypt.compareSync(req.body.password, userFound.password);
                
                if (passwordOk) {
                    // 3. ¡Entró bien! Lo paso a objeto plano y le vuelo la contraseña antes de mandarlo a la sesión
                    const userToLogin = userFound.toJSON();
                    delete userToLogin.password;
                    
                    // Guardo los datos del usuario en req.session para que mi servidor lo recuerde mientras navega
                    req.session.userLogged = userToLogin;

                    // 4. Si tildó la cajita de "Recordarme", le clavo una cookie que dura un año
                    if (req.body.remember) {
                        res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60 * 60 * 24 * 365) });
                    }

                    // 5. Lo pateo a mi vista de Perfil
                    return res.redirect('/usuarios/perfil');
                }
                
                // Si le erró a la contraseña, lo devuelvo a la vista de login
                return res.render('users/login');
            }
            
            // Si el email directamente no existe en mi base, también lo devuelvo al login
            return res.render('users/login');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return res.render('users/login');
        }
    },

    // Acá armo la función para mostrar mi perfil
    profile: (req, res) => {
        // Le paso a la vista los datos del usuario que tengo guardados en la sesión
        res.render('users/profile', { user: req.session.userLogged });
    },

    // Me dejo armada la función para cerrar sesión así el botón de mi perfil funciona
    logout: (req, res) => {
        // Borro la cookie por si me había puesto "Recordarme"
        res.clearCookie('userEmail');
        // Destruyo la sesión en el servidor
        req.session.destroy();
        // Lo pateo al inicio de la página
        return res.redirect('/');
    }
};

module.exports = usersController;