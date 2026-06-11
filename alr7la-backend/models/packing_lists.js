'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PackingLists extends Model {
    static associate(models) {
      PackingLists.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      PackingLists.belongsTo(models.Trips, {
        foreignKey: 'trip_id'
      });
      PackingLists.hasMany(models.PackingSections, {
        foreignKey: 'packing_list_id',
        onDelete: 'CASCADE'
      });
    }
  }

  PackingLists.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'PackingLists',
    tableName: 'packing_lists',
    timestamps: true,
    underscored: true
  });

  return PackingLists;
}; 