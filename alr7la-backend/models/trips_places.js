'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TripsPlaces extends Model {
    static associate(models) {
      // Define associations
      TripsPlaces.belongsTo(models.Trips, {
        foreignKey: 'trip_id'
      });
      TripsPlaces.belongsTo(models.Places, {
        foreignKey: 'place_id'
      });
    }
  }
  
  TripsPlaces.init(
    {
      trip_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'trips',
          key: 'id'
        }
      },
      place_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'places',
          key: 'id'
        }
      },
      time:{
        type: DataTypes.STRING,
        allowNull: true
      },
      notes:{
        type: DataTypes.STRING,
        allowNull: true
      },
      day:{
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'TripsPlaces',
      tableName: 'trips_places',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return TripsPlaces;
};