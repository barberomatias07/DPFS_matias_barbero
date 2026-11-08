const express = require('express');
const path = require('path');
const methodOverride = require('method-override'); // <-- ACÁ TRAEMOS EL TRADUCTOR

// Requerimos el archivo de rutas
const mainRoutes = require('./routes/mainRoutes');

const app = express();

// Configurar archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Habilitamos a Express para capturar datos de formularios (POST)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// <-- ACÁ LO ACTIVAMOS (siempre antes de las rutas)
app.use(methodOverride('_method')); 

// Le decimos a Express que use las rutas separadas
app.use('/', mainRoutes);

// Levantamos el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor de Cultura Nacional prendido y escuchando en http://localhost:${PORT}!`);
});