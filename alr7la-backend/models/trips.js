'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trips extends Model {
    static associate(models) {
      // Define associations
      Trips.belongsToMany(models.Places, {
        through: models.TripsPlaces,
        foreignKey: 'trip_id',
        otherKey: 'place_id'
      });

      Trips.hasMany(models.UserTrips, {
        foreignKey: 'trip_id',
        onDelete: 'CASCADE'
      });
    }
  }

  Trips.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trip_description: {
        type: DataTypes.TEXT,
      },
      start_time: {
        type: DataTypes.DATE,
      },
      end_time: {
        type: DataTypes.DATE,
      },
      trip_status: {
        type: DataTypes.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
      },
      trip_pace: {
        type: DataTypes.ENUM('slow-paced', 'moderate', 'fast-paced'),
      },
      country: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING
      },
      trip_style: {
        type: DataTypes.ENUM('budget', 'moderate', 'luxury'),
      }
    },
    {
      sequelize,
      modelName: 'Trips',
      tableName: 'trips',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );

  return Trips;
};