module.exports = (sequelize, DataTypes) => {
    // Modelo para los talles disponibles (S, M, L, XL)
    const Size = sequelize.define('Size', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'sizes',
        timestamps: false
    });

    Size.associate = (models) => {
        // Conecto talles con productos en relación muchos a muchos usando la tabla intermedia product_sizes
        Size.belongsToMany(models.Product, {
            as: 'products',
            through: 'product_sizes',
            foreignKey: 'size_id',
            otherKey: 'product_id',
            timestamps: false
        });
    };

    return Size;
};