module.exports = (sequelize, DataTypes) => {
    // Defino el modelo de roles para diferenciar si el usuario es admin o cliente
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'roles',
        timestamps: false // Esta tabla no tiene created_at ni updated_at
    });

    Role.associate = (models) => {
        // Un rol puede tener muchos usuarios asignados
        Role.hasMany(models.User, {
            as: 'users',
            foreignKey: 'role_id'
        });
    };

    return Role;
};