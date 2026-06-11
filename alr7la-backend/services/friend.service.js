const { Friends, Users } = require('../models');
const { Op } = require('sequelize');

const findAcceptedFriends = async (userId) => {
    return await Friends.findAll({
        where: {
            status: 'accepted',
            [Op.or]: [
                { user_id: userId },
                { friend_id: userId }
            ]
        },
        include: [
            {
                model: Users,
                as: 'User',
                attributes: ['id', 'name', 'profile_picture'],
            },
            {
                model: Users,
                as: 'Friend',
                attributes: ['id', 'name', 'profile_picture'],
            }
        ]
    });
};

module.exports = {
    findAcceptedFriends
}; 