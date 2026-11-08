const fs = require('fs');
const path = require('path');

// 1. Apuntamos a donde está el archivo JSON
const productsFilePath = path.join(__dirname, '../data/products.json');
// 2. Leemos el archivo y lo convertimos a formato JavaScript
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const mainController = {
    home: (req, res) => {
        // 3. Le enviamos los productos a la vista 'index'
        res.render('index', { products: products });
    },
    detalle: (req, res) => {
        // Atrapamos el ID que viene en la URL por el parámetro :id
        let idRemera = req.params.id;
        
        // Buscamos en el array de productos el que coincida con ese ID
        let remeraEncontrada = products.find(producto => producto.id === idRemera);
        
        // Renderizamos la vista y le enviamos la información de la remera específica
        res.render('products/productDetail', { producto: remeraEncontrada });
    },
    carrito: (req, res) => {
        res.render('products/productCart');
    },
    login: (req, res) => {
        res.render('users/login');
    },
    register: (req, res) => {
        res.render('users/register');
    },
    crearProducto: (req, res) => {
        res.render('products/productAdd');
    },
    // ACA ESTA LA FUNCION PARA GUARDAR EL FORMULARIO:
    guardarProducto: (req, res) => {
        // 1. Armamos el objeto con los datos que llegaron del formulario
        let nuevoProducto = {
            id: Date.now().toString(), // Generamos un ID único automático
            name: req.body.name,
            frase: "Nuevo diseño", // Tu formulario no tiene campo frase, le ponemos uno genérico
            description: req.body.description,
            // ¡EL TOQUE FINAL! Atrapamos el nombre del archivo de Multer:
            image: req.file ? req.file.filename : "default-image.png",
            category: req.body.category,
            talles: req.body.sizes ? req.body.sizes.split(',').map(t => t.trim()) : [], // Convierte "S, M, L" en un array y limpia espacios
            price: Number(req.body.price)
        };
        
        // 2. Lo empujamos al array de productos
        products.push(nuevoProducto);
        
        // 3. Sobreescribimos el archivo JSON original con la lista actualizada
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
        
        // 4. Redirigimos a la Home para que veas tu nueva remera en pantalla
        res.redirect('/');
    },
    
    editarProducto: (req, res) => {
        // 1. Atrapamos el ID de la URL
        let idRemera = req.params.id;
        
        // 2. Buscamos la remera en el JSON
        let remeraEncontrada = products.find(producto => producto.id === idRemera);
        
        // 3. Si no la encuentra, mandamos al inicio para que no rompa
        if (!remeraEncontrada) {
            return res.redirect('/');
        }

        // 4. Renderizamos la vista y LE PASAMOS LOS DATOS
        res.render('products/productEdit', { producto: remeraEncontrada });
    },

    // ==========================================
    // FUNCIÓN QUE RECIBE EL PUT (EDITAR)
    // ==========================================
    actualizarProducto: (req, res) => {
        let idRemera = req.params.id;
        
        // 1. Buscamos la remera exacta en el array
        let productoAEditar = products.find(producto => producto.id === idRemera);
        
        if (productoAEditar) {
            // 2. ¿Subió imagen nueva? Si hay foto nueva la usamos. Si no, dejamos la que ya tenía.
            let imagenFinal = req.file ? req.file.filename : productoAEditar.image;
            
            // 3. Pisamos los datos viejos con los datos nuevos del formulario
            productoAEditar.name = req.body.name;
            productoAEditar.description = req.body.description;
            productoAEditar.image = imagenFinal;
            productoAEditar.category = req.body.category;
            productoAEditar.talles = req.body.sizes ? req.body.sizes.split(',').map(t => t.trim()) : [];
            productoAEditar.price = Number(req.body.price);
            
            // 4. Guardamos la lista completa con los cambios en el JSON
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
        }
        
        // 5. Redirigimos a la Home para ver el cambio aplicado
        res.redirect('/');
    },

    // ==========================================
    // ¡ACÁ ESTÁ LA NUEVA FUNCIÓN PARA BORRAR (DELETE)!
    // ==========================================
    borrarProducto: (req, res) => {
        let idRemera = req.params.id;
        
        // 1. Buscamos en qué posición (índice) de la lista está este producto
        let indice = products.findIndex(producto => producto.id === idRemera);
        
        // 2. Si lo encuentra (índice distinto de -1), lo arrancamos de la lista
        if (indice !== -1) {
            products.splice(indice, 1); // Elimina 1 elemento en la posición que encontró
            
            // 3. Sobreescribimos el JSON con la lista nueva (ya sin este producto)
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
        }
        
        // 4. Redirigimos a la Home para ver que efectivamente desapareció
        res.redirect('/');
    }
};

module.exports = mainController;