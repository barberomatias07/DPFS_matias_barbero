const express = require('express');
const path = require('path');

// 1. Requerimos el archivo de rutas que acabás de crear
const mainRoutes = require('./routes/mainRoutes');

const app = express();

// Configurar archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Le decimos a Express que use las rutas separadas
app.use('/', mainRoutes);

// Levantamos el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor de Cultura Nacional prendido y escuchando en http://localhost:${PORT}!`);
});