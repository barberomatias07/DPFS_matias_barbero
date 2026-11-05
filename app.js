const express = require('express');
const path = require('path');

const app = express();

// Le decimos a Express que permita leer los archivos de esta carpeta (para que cargue tus CSS y las imágenes)
app.use(express.static(__dirname));

// Ruta principal: Cuando entremos a localhost:3000, va a cargar tu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para el detalle estático general
app.get('/detalle', (req, res) => {
    res.sendFile(path.join(__dirname, 'productDetail.html'));
});

// Ruta para el carrito
app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, 'productCart.html'));
});

// Levantamos el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('¡Servidor de Cultura Nacional prendido y escuchando en http://localhost:3000!');
});