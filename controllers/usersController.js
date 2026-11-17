const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Apunto a mi archivo JSON donde guardo los usuarios
const usersFilePath = path.join(__dirname, '../data/users.json');

// Me armo esta funcioncita para leer el JSON siempre fresco y que no me tire error si está vacío
const getUsers = () => {
    const usersJSON = fs.readFileSync(usersFilePath, 'utf-8');
    return usersJSON ? JSON.parse(usersJSON) : [];
};

const usersController = {
    // Muestro la vista del formulario de registro
    register: (req, res) => {
        res.render('users/register');
    },
    
    // Acá atrapo el POST del registro, encripto la clave y guardo mi usuario nuevo
    processRegister: (req, res) => {
        let users = getUsers();

        let newUser = {
            id: Date.now().toString(),
            fullName: req.body.fullName,
            email: req.body.email,
            // Le paso el bcrypt para que la contraseña quede encriptada y no se lea cruda en mi JSON
            password: bcrypt.hashSync(req.body.password, 10),
            // Si subí una foto por multer la uso, sino le clavo la imagen por defecto
            avatar: req.file ? req.file.filename : 'default-avatar.png'
        };

        // Empujo el usuario al array y reescribo mi JSON
        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, ' '));

        // Lo pateo al login para que entre de una con su cuenta recién creada
        res.redirect('/usuarios/login');
    },

    // Muestro la vista del formulario de login
    login: (req, res) => {
        res.render('users/login');
    },

    // Esta función procesa los datos que me llegan por POST desde el formulario de Iniciar Sesión
    processLogin: (req, res) => {
        // Me traigo todos los usuarios de mi JSON
        let users = getUsers();
        
        // 1. Busco a ver si encuentro algún usuario que tenga el mismo email que llegó del input
        let userToLogin = users.find(user => user.email === req.body.email);

        if (userToLogin) {
            // 2. Si el email existe, comparo la contraseña del input con la que tengo guardada (encriptada)
            let passwordOk = bcrypt.compareSync(req.body.password, userToLogin.password);
            
            if (passwordOk) {
                // 3. ¡Entró bien! Por seguridad le vuelo la contraseña al objeto antes de mandarlo a la sesión
                delete userToLogin.password;
                
                // Guardo los datos del usuario en req.session para que mi servidor lo recuerde mientras navega
                req.session.userLogged = userToLogin;

                // 4. Si el loco tildó la cajita de "Recordarme", le clavo una cookie que dura un año
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