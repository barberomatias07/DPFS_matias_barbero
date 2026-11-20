const db = require('../../database/models');

const usersApiController = {
    list: async (req, res) => {
        try {
            const usersDB = await db.User.findAll();
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const users = usersDB.map(user => ({
                id: user.id,
                name: user.fullName,
                email: user.email,
                detail: `${baseUrl}/api/users/${user.id}`
            }));

            return res.status(200).json({
                count: users.length,
                users
            });
        } catch (error) {
            console.error('Error en API listado de usuarios:', error);
            return res.status(500).json({ error: 'Error al obtener el listado de usuarios' });
        }
    },

    detail: async (req, res) => {
        try {
            const userDB = await db.User.findByPk(req.params.id);

            if (!userDB) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const user = userDB.toJSON();
            delete user.password;
            delete user.roleId;

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const avatarFile = user.avatar || 'avatar-default.png';

            return res.status(200).json({
                ...user,
                avatarUrl: `${baseUrl}/images/users/${avatarFile}`
            });
        } catch (error) {
            console.error('Error en API detalle de usuario:', error);
            return res.status(500).json({ error: 'Error al obtener el detalle del usuario' });
        }
    }
};

module.exports = usersApiController;