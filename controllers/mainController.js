const mainController = {
    home: (req, res) => {
        res.render('index');
    },
    detalle: (req, res) => {
        res.render('products/productDetail');
    },
    carrito: (req, res) => {
        res.render('products/productCart');
    },
    login: (req, res) => {
        res.render('users/login');
    },
    crearProducto: (req, res) => {
        res.render('products/productAdd');
    },
    editarProducto: (req, res) => {
        res.render('products/productEdit');
    }
};

// Exportamos esto para que el resto del programa lo pueda usar
module.exports = mainController;