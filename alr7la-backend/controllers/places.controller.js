const { where } = require('sequelize');
const models = require('../models');

module.exports = {
  // GET: Fetch all places
  async getAll(req, res) {
    try {
      const { name } = req.query;
      const { Op } = models.Sequelize;
      
      let whereClause = {};
      if (name) {
        whereClause = {
          [Op.or]: [
            { name: { [Op.like]: `%${name}%` } },
            { city: { [Op.like]: `%${name}%` } },
            { country: { [Op.like]: `%${name}%` } }
          ]
        };
      }
      
      const places = await models.Places.findAll({
        where: whereClause,
        order: [
          ['number_of_ratings', 'DESC'],
          ['rating', 'DESC']
        ],
        include: [
          {
            model: models.PlacesImages,
            attributes: ['img_url']
          },
          {
            model: models.Labels,
            through: { attributes: [] }
          },
          {
            model: models.Countries,
            attributes: ['name', 'iso_alpha2']
          }
        ],
        limit: 50 // Limit results for better performance
      });      
      
      console.log(`Found ${places.length} places for search term: "${name}"`);
      res.status(200).json(places);
    } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({ message: 'Error fetching places', error });
    }
  },  

  async getByCountry(req, res) {
    try {
        const { country } = req.params;
        const offset = parseInt(req.query.offset, 10) || 0;

        const places = await models.Places.findAll({
            limit: 10,
            order: [
                ['number_of_ratings', 'DESC'],
                ['rating', 'DESC']
            ],
            where: { country: country },
            offset: offset,
            include: [
              {
                model: models.PlacesImages,
                attributes: ['img_url']
              },
              {
                model: models.Labels,
                through: { attributes: [] }
              },
              {
                model: models.Countries,
                attributes: ['name', 'iso_alpha2']
              }
            ]
        });

        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching places', error });
    }
  },

  async getByCity(req, res) {
    try {
        const { city } = req.params;
        const offset = parseInt(req.query.offset, 10) || 0;

        const places = await models.Places.findAll({
            limit: 10,
            order: [
                ['number_of_ratings', 'DESC'],
                ['rating', 'DESC']
            ],
            where: { city: city },
            offset: offset,
            include: [
              {
                model: models.PlacesImages,
                attributes: ['img_url']
              },
              {
                model: models.Labels,
                through: { attributes: [] }
              },
              {
                model: models.Countries,
                attributes: ['name', 'iso_alpha2']
              }
            ]
        });

        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching places', error });
    }
  },

  // GET: Fetch a specific place by id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const place = await models.Places.findByPk(id, {
        include: [
          {
            model: models.PlacesImages,
            attributes: ['img_url']
          },
          {
            model: models.Labels,
            through: { attributes: [] }
          },
          {
            model: models.Countries,
            attributes: ['name']
          }
        ]
      });
      if (!place) {
        return res.status(404).json({ message: 'place not found' });
      }
      res.status(200).json(place);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching place', error });
    }
  },

  // POST: Create a new place
  async create(req, res) {
    try {
      const place = JSON.parse(req.body.place);
      const newplace = await models.Places.create(place);
      res.status(201).json(newplace);
    } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({ message: 'Error creating place', error });
    }
  },

  // PUT: Update an existing place by id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { place } = req.body;
      console.log(req.body)

      const new_place = await models.Places.findByPk(id);
      if (!new_place) {
        return res.status(404).json({ message: 'place not found' });
      }

      const updatedplace = await new_place.update(place);

      res.status(200).json(updatedplace);
    } catch (error) {
      res.status(500).json({ message: 'Error updating place', error });
    }
  },

  // DELETE: Remove an place by id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const place = await models.Places.findByPk(id);
      if (!place) {
        return res.status(404).json({ message: 'place not found' });
      }

      await place.destroy();
      res.status(200).json({ message: 'place deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting place', error });
    }
  }
};
