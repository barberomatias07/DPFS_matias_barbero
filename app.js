const express = require('express');
const path = require('path');
const methodOverride = require('method-override'); // <-- ACÁ TRAIGO EL TRADUCTOR
const session = require('express-session'); // <-- NUEVO: Para mantener mi sesión abierta
const cookieParser = require('cookie-parser'); // <-- NUEVO: Para guardar mi cookie de "recordarme"
const cors = require('cors'); // <-- NUEVO: Habilito CORS para que React pueda consumir la API

// Me traigo mi middleware global para atajar si estoy logueado o no en cualquier parte de la página
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

// Requiero mis archivos de rutas
const mainRoutes = require('./routes/mainRoutes');
const usersRoutes = require('./routes/usersRoutes'); // <-- NUEVO: Mis rutas exclusivas de usuarios
const usersApiRoutes = require('./routes/api/usersApiRoutes'); // <-- NUEVO: API de usuarios
const productsApiRoutes = require('./routes/api/productsApiRoutes'); // <-- NUEVO: API de productos

const app = express();

// Habilito pedidos externos (ej: Dashboard en React)
app.use(cors());

// Configuro mis archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configuro EJS como mi motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Habilito a Express para capturar datos de mis formularios (POST)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ACÁ LO ACTIVO (siempre antes de mis rutas)
app.use(methodOverride('_method')); 

// ==========================================
// CONFIGURACIÓN DE MIS SESIONES Y COOKIES
// ==========================================
app.use(session({
    secret: 'secreto_cultura_nacional_123', // Palabra clave para encriptar mi sesión en el server
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());

// ==========================================
// MIDDLEWARES DE APLICACIÓN
// ==========================================
// Activo el patovica global: tiene que ir SÍ O SÍ abajo del session/cookieParser y antes de mis rutas
app.use(userLoggedMiddleware);

// ==========================================
// RUTAS
// ==========================================
app.use('/', mainRoutes);
// Le digo que todo lo que arranque con /usuarios vaya a mi archivo nuevo
app.use('/usuarios', usersRoutes); 
// Endpoints de API REST para el Dashboard
app.use('/api/users', usersApiRoutes);
app.use('/api/products', productsApiRoutes);

// Levanto mi servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor de Cultura Nacional prendido y escuchando en http://localhost:${PORT}!`);
});