'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserTrips extends Model {
    static associate(models) {
      // Define associations
      UserTrips.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      UserTrips.belongsTo(models.Trips, {
        foreignKey: 'trip_id'
      });
    }
  }
  
  UserTrips.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      trip_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'trips',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: 'UserTrips',
      tableName: 'user_trips',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return UserTrips;
};