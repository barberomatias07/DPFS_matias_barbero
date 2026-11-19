module.exports = (sequelize, DataTypes) => {
    // Defino las categorías de las prendas (Remera, Buzo, Accesorio)
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'categories',
        timestamps: false
    });

    Category.associate = (models) => {
        // Una categoría agrupa muchos productos
        Category.hasMany(models.Product, {
            as: 'products',
            foreignKey: 'category_id'
        });
    };

    return Category;
};