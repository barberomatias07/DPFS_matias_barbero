module.exports = (sequelize, DataTypes) => {
    // Armo el modelo de usuarios respetando las columnas que creé en MySQL
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: 'full_name' // Lo mapeo con el nombre exacto de la columna en la base
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'avatar-default.png'
        },
        roleId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 2,
            field: 'role_id'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true // Para que Sequelize entienda created_at y updated_at con guion bajo
    });

    User.associate = (models) => {
        // Cada usuario pertenece a un rol (admin o customer)
        User.belongsTo(models.Role, {
            as: 'role',
            foreignKey: 'role_id'
        });
    };

    return User;
};