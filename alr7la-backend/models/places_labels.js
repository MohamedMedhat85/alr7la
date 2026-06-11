'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlacesLabels extends Model {
    static associate(models) {
      // Define associations
      PlacesLabels.belongsTo(models.Places, {
        foreignKey: 'place_id',
        as: 'Place'
      });
      PlacesLabels.belongsTo(models.Labels, {
        foreignKey: 'label_id',
        as: 'Label'
      });
    }
  }
  
  PlacesLabels.init(
    {
      place_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'places',
          key: 'id'
        }
      },
      label_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'labels',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: 'PlacesLabels',
      tableName: 'places_labels',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return PlacesLabels;
};