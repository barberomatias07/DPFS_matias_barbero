module.exports = (sequelize, DataTypes) => {
    // Modelo principal de mis productos con todos los campos de la tienda
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        frase: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'default-product.png'
        },
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'category_id'
        }
    }, {
        tableName: 'products',
        timestamps: true,
        underscored: true
    });

    Product.associate = (models) => {
        // Cada producto pertenece a una categoría
        Product.belongsTo(models.Category, {
            as: 'category',
            foreignKey: 'category_id'
        });

        // Un producto puede tener varios talles a través de la tabla intermedia
        Product.belongsToMany(models.Size, {
            as: 'sizes',
            through: 'product_sizes',
            foreignKey: 'product_id',
            otherKey: 'size_id',
            timestamps: false
        });
    };

    return Product;
};