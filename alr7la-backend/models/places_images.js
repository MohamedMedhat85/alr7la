'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlacesImages extends Model {
    static associate(models) {
      // Define associations
      PlacesImages.belongsTo(models.Places, {
        foreignKey: 'place_id'
      });
    }
  }
  
  PlacesImages.init(
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
      img_url: {
        type: DataTypes.STRING(255),
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'PlacesImages',
      tableName: 'places_images',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return PlacesImages;
};