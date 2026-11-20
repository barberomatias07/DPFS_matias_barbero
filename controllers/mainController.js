// Me traigo los modelos de Sequelize para consultar la base de datos en lugar del JSON
const db = require('../database/models');
const { validationResult } = require('express-validator');
const { borrarImagenProducto } = require('../middlewares/productValidations');

// Función auxiliar para acomodar los datos de Sequelize al formato que ya esperan mis vistas EJS
const formatearProducto = (prod) => {
    const data = prod.toJSON();
    return {
        ...data,
        price: Number(data.price),
        category: data.category ? data.category.name : 'Remera',
        talles: data.sizes ? data.sizes.map(s => s.name) : []
    };
};

// Función auxiliar para buscar el ID de la categoría según lo que escriba o elija en el formulario
const resolverCategoriaId = async (nombreCategoria) => {
    if (!nombreCategoria) return 1; // Por defecto cae en Remera (id 1)
    const limpia = nombreCategoria.trim();
    const categorias = await db.Category.findAll();
    const encontrada = categorias.find(c => c.name.toLowerCase() === limpia.toLowerCase());
    if (encontrada) return encontrada.id;

    // Si escribí una categoría nueva que no existía en la tabla, la creo en el momento
    const nueva = await db.Category.create({ name: limpia });
    return nueva.id;
};

const mainController = {
    home: async (req, res) => {
        try {
            // Me traigo todos los productos de MySQL incluyendo su categoría y sus talles
            const productosDB = await db.Product.findAll({
                include: ['category', 'sizes']
            });
            const products = productosDB.map(formatearProducto);

            // Le mando los productos a la vista 'index'
            res.render('index', { products });
        } catch (error) {
            console.error('Error al cargar el inicio:', error);
            res.status(500).send('Error al cargar los productos desde la base de datos');
        }
    },

    detalle: async (req, res) => {
        try {
            // Busco en la base el producto que coincida con el ID de la URL
            const remeraDB = await db.Product.findByPk(req.params.id, {
                include: ['category', 'sizes']
            });

            if (!remeraDB) {
                return res.redirect('/');
            }

            const remeraEncontrada = formatearProducto(remeraDB);
            res.render('products/productDetail', { producto: remeraEncontrada });
        } catch (error) {
            console.error('Error al cargar el detalle:', error);
            res.redirect('/');
        }
    },

    // ==========================================
    // FUNCIONES DEL CARRITO DE COMPRAS (SESSION + MYSQL)
    // ==========================================
    carrito: (req, res) => {
        const carrito = req.session.carrito || [];
        const total = carrito.reduce((acum, item) => acum + (Number(item.price) * Number(item.cantidad)), 0);
        const compraExitosa = req.query.compra === 'ok';

        res.render('products/productCart', { carrito, total, compraExitosa });
    },

    agregarAlCarrito: async (req, res) => {
        try {
            // Busco el producto real en MySQL para asegurar que el precio y los datos vengan de la base
            const productoDB = await db.Product.findByPk(req.params.id);

            if (!productoDB) {
                return res.redirect('/');
            }

            if (!req.session.carrito) {
                req.session.carrito = [];
            }

            const talleElegido = req.body.talle || 'M';
            const idProducto = Number(productoDB.id);

            // Me fijo si ya está exactamente la misma remera con el mismo talle en el carrito
            const itemExistente = req.session.carrito.find(
                item => item.id === idProducto && item.talle === talleElegido
            );

            if (itemExistente) {
                itemExistente.cantidad += 1;
            } else {
                req.session.carrito.push({
                    id: idProducto,
                    name: productoDB.name,
                    price: Number(productoDB.price),
                    image: productoDB.image,
                    talle: talleElegido,
                    cantidad: 1
                });
            }

            return res.redirect('/carrito');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            return res.redirect('/');
        }
    },

    actualizarCarrito: (req, res) => {
        const index = Number(req.params.index);
        const nuevaCantidad = Number(req.body.cantidad);

        if (req.session.carrito && req.session.carrito[index]) {
            if (nuevaCantidad > 0) {
                req.session.carrito[index].cantidad = nuevaCantidad;
            } else {
                req.session.carrito.splice(index, 1);
            }
        }

        return res.redirect('/carrito');
    },

    eliminarDelCarrito: (req, res) => {
        const index = Number(req.params.index);

        if (req.session.carrito && req.session.carrito[index]) {
            req.session.carrito.splice(index, 1);
        }

        return res.redirect('/carrito');
    },

    finalizarCompra: (req, res) => {
        req.session.carrito = [];
        return res.redirect('/carrito?compra=ok');
    },

    login: (req, res) => {
        res.render('users/login');
    },

    register: (req, res) => {
        res.render('users/register');
    },

    crearProducto: async (req, res) => {
        try {
            // Le paso también las categorías y talles por si los quiero usar en la vista
            const categories = await db.Category.findAll();
            const sizes = await db.Size.findAll();
            res.render('products/productAdd', { categories, sizes });
        } catch (error) {
            console.error('Error al abrir formulario de creación:', error);
            res.render('products/productAdd');
        }
    },

    // ==========================================
    // FUNCIÓN PARA GUARDAR UN PRODUCTO NUEVO (CREATE)
    // ==========================================
    guardarProducto: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                borrarImagenProducto(req.file);
                const categories = await db.Category.findAll();
                const sizes = await db.Size.findAll();
                return res.render('products/productAdd', {
                    categories,
                    sizes,
                    errors: errors.mapped(),
                    oldData: req.body
                });
            }

            const categoryId = await resolverCategoriaId(req.body.category);

            // Guardo el producto nuevo en la tabla products de MySQL
            const nuevoProducto = await db.Product.create({
                name: req.body.name,
                frase: req.body.frase || 'Nuevo diseño',
                description: req.body.description,
                image: req.file ? req.file.filename : 'default-image.png',
                price: Number(req.body.price),
                categoryId: categoryId
            });

            // Si cargué talles separados por coma, los busco en la tabla sizes y los vinculo en product_sizes
            if (req.body.sizes) {
                const listaTalles = req.body.sizes
                    .split(',')
                    .map(t => t.trim().toUpperCase())
                    .filter(Boolean);
                const tallesDB = await db.Size.findAll({ where: { name: listaTalles } });
                await nuevoProducto.setSizes(tallesDB);
            }

            res.redirect('/');
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            res.status(500).send('No se pudo guardar el producto');
        }
    },

    editarProducto: async (req, res) => {
        try {
            // Busco la remera en la base por su ID
            const remeraDB = await db.Product.findByPk(req.params.id, {
                include: ['category', 'sizes']
            });

            if (!remeraDB) {
                return res.redirect('/');
            }

            const remeraEncontrada = formatearProducto(remeraDB);
            res.render('products/productEdit', { producto: remeraEncontrada });
        } catch (error) {
            console.error('Error al abrir edición:', error);
            res.redirect('/');
        }
    },

    // ==========================================
    // FUNCIÓN QUE RECIBE EL PUT PARA EDITAR (UPDATE)
    // ==========================================
    actualizarProducto: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                borrarImagenProducto(req.file);
                const remeraDB = await db.Product.findByPk(req.params.id, {
                    include: ['category', 'sizes']
                });

                if (!remeraDB) {
                    return res.redirect('/');
                }

                const remeraEncontrada = formatearProducto(remeraDB);
                return res.render('products/productEdit', {
                    producto: remeraEncontrada,
                    errors: errors.mapped(),
                    oldData: req.body
                });
            }

            const productoAEditar = await db.Product.findByPk(req.params.id);

            if (productoAEditar) {
                // Si subí imagen nueva la uso; si no, dejo la que ya tenía guardada
                const imagenFinal = req.file ? req.file.filename : productoAEditar.image;
                const categoryId = await resolverCategoriaId(req.body.category);

                // Actualizo los datos en la tabla products
                await productoAEditar.update({
                    name: req.body.name,
                    frase: req.body.frase || productoAEditar.frase,
                    description: req.body.description,
                    image: imagenFinal,
                    price: Number(req.body.price),
                    categoryId: categoryId
                });

                // Actualizo los talles en la tabla intermedia product_sizes
                const listaTalles = req.body.sizes
                    ? req.body.sizes.split(',').map(t => t.trim().toUpperCase()).filter(Boolean)
                    : [];
                const tallesDB = listaTalles.length
                    ? await db.Size.findAll({ where: { name: listaTalles } })
                    : [];
                await productoAEditar.setSizes(tallesDB);
            }

            res.redirect('/');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            res.status(500).send('No se pudo actualizar el producto');
        }
    },

    // ==========================================
    // FUNCIÓN PARA BORRAR UN PRODUCTO (DELETE)
    // ==========================================
    borrarProducto: async (req, res) => {
        try {
            // Borro el producto de MySQL (y por el ON DELETE CASCADE se limpian sus talles en product_sizes)
            await db.Product.destroy({
                where: { id: req.params.id }
            });

            res.redirect('/');
        } catch (error) {
            console.error('Error al borrar el producto:', error);
            res.status(500).send('No se pudo borrar el producto');
        }
    }
};

module.exports = mainController;