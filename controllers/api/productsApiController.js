const db = require('../../database/models');

const productsApiController = {
    list: async (req, res) => {
        try {
            const productsDB = await db.Product.findAll({
                include: ['category', 'sizes']
            });
            const categoriesDB = await db.Category.findAll();
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            // Inicializo todas las categorías existentes en 0 y cuento cuántos productos tiene cada una
            const countByCategory = {};
            categoriesDB.forEach(cat => {
                countByCategory[cat.name] = 0;
            });

            productsDB.forEach(prod => {
                const catName = prod.category ? prod.category.name : 'Sin categoría';
                countByCategory[catName] = (countByCategory[catName] || 0) + 1;
            });

            const products = productsDB.map(prod => {
                const data = prod.toJSON();
                return {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    price: Number(data.price),
                    categories: data.category ? [data.category] : [],
                    sizes: data.sizes ? data.sizes.map(s => s.name) : [],
                    detail: `${baseUrl}/api/products/${data.id}`
                };
            });

            return res.status(200).json({
                count: products.length,
                countByCategory,
                products
            });
        } catch (error) {
            console.error('Error en API listado de productos:', error);
            return res.status(500).json({ error: 'Error al obtener el listado de productos' });
        }
    },

    detail: async (req, res) => {
        try {
            const productDB = await db.Product.findByPk(req.params.id, {
                include: ['category', 'sizes']
            });

            if (!productDB) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const data = productDB.toJSON();
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const imageFile = data.image || 'default-image.png';

            return res.status(200).json({
                ...data,
                price: Number(data.price),
                categories: data.category ? [data.category] : [],
                sizes: data.sizes || [],
                imageUrl: `${baseUrl}/images/${imageFile}`
            });
        } catch (error) {
            console.error('Error en API detalle de producto:', error);
            return res.status(500).json({ error: 'Error al obtener el detalle del producto' });
        }
    }
};

module.exports = productsApiController;