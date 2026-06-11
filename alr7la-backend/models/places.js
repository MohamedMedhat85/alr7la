'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Places extends Model {
    static associate(models) {
      // Define associations
      Places.hasMany(models.PlacesImages, {
        foreignKey: 'place_id'
      });
      
      Places.belongsToMany(models.Labels, {
        through: models.PlacesLabels,
        foreignKey: 'place_id',
        otherKey: 'label_id'
      });
      
      Places.belongsToMany(models.Trips, {
        through: models.TripsPlaces,
        foreignKey: 'place_id',
        otherKey: 'trip_id'
      });
      
      Places.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      });
      
      Places.hasMany(models.Reviews, {
        foreignKey: 'place_id',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Places.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
      },
      latitude: {
        type: DataTypes.DECIMAL(11, 8),
      },
      city: {
        type: DataTypes.STRING(100),
      },
      country: {
        type: DataTypes.STRING(100),
      },
      country_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'countries',
          key: 'id'
        }
      },
      open_hours: {
        type: DataTypes.TIME,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
      },
      number_of_ratings: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Places',
      tableName: 'places',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Places;
};