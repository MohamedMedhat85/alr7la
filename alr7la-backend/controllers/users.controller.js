const { Op, literal } = require('sequelize'); // import Op and literal
const { Users, Countries } = require('../models');

exports.getUsers = async (req, res) => {
    try {
        const { name = '', limit = 10, offset = 0, country_id } = req.query;
        const limitInt = parseInt(limit, 10);
        const offsetInt = parseInt(offset, 10);

        // Base WHERE clause for name filtering
        const where = {
            name: {
                [Op.like]: `%${name}%`
            }
        };

        // Build ordering array
        const order = [];

        if (country_id) {
            // Prioritize users with matching country_id
            order.push([
                literal(`CASE WHEN country_id = ${parseInt(country_id, 10)} THEN 0 ELSE 1 END`),
                'ASC'
            ]);
        }

        // Secondary ordering by name ascending
        order.push(['name', 'ASC']);

        const result = await Users.findAndCountAll({
            where,
            limit: limitInt,
            offset: offsetInt,
            attributes: ['id', 'name', 'profile_picture', 'bio', 'country_id'], // added country_id to attributes
            include: [{
                model: Countries,
                attributes: ['id', 'name'],
            }],
            order
        });

        res.json({
            count: result.count,
            users: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
