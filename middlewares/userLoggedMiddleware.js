const fs = require('fs');
const path = require('path');

// Me traigo mi función para leer el JSON de usuarios
const getUsers = () => {
    const usersJSON = fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8');
    return usersJSON ? JSON.parse(usersJSON) : [];
};

function userLoggedMiddleware(req, res, next) {
    // 1. De entrada asumo que nadie está logueado, así que mando false a la vista
    res.locals.isLogged = false;

    // 2. Chequeo si el usuario tiene mi cookie de "Recordarme" en su navegador
    let emailInCookie = req.cookies.userEmail;
    let userFromCookie = null;

    if (emailInCookie) {
        // Si hay cookie, busco a ese usuario en mi JSON
        let users = getUsers();
        userFromCookie = users.find(user => user.email === emailInCookie);
    }

    // 3. Si encontré al usuario por la cookie, lo meto de prepo en la sesión para que no tenga que volver a poner la clave
    if (userFromCookie) {
        req.session.userLogged = userFromCookie;
    }

    // 4. Si efectivamente hay alguien en sesión (ya sea porque se logueó recién o porque lo salvó la cookie)
    if (req.session.userLogged) {
        // Le digo a mis vistas (EJS) que SÍ hay alguien logueado
        res.locals.isLogged = true;
        // Le paso a la variable "locals" todos los datos del usuario para poder imprimir su nombre en el Header
        res.locals.userLogged = req.session.userLogged;
    }

    // Le doy mecha para que la página siga cargando normalmente
    next();
}

module.exports = userLoggedMiddleware;