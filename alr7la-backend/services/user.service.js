const { Users, Countries, Labels } = require('../models');

const findUserById = async (userId) => {
    return await Users.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'birth_date', 'gender', 'profile_picture', 'bio', 'wallpaper', 'marital_status', 'created_at'],
        include: [
            {
                model: Countries,
                attributes: ['name'],
            },
            {
                model: Labels,
                through: { attributes: [] }
            },
        ],
    });
};

module.exports = {
    findUserById
}; 