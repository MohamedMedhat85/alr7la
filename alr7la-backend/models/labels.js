'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Labels extends Model {
    static associate(models) {
      // Define associations
      Labels.belongsToMany(models.Places, {
        through: models.PlacesLabels,
        foreignKey: 'label_id',
        otherKey: 'place_id'
      });
      
      Labels.belongsToMany(models.Users, {
        through: models.Preferences,
        foreignKey: 'label_id',
        otherKey: 'user_id'
      });
    }
  }
  
  Labels.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      label_name: {
        type: DataTypes.STRING(100),
      },
    },
    {
      sequelize,
      modelName: 'Labels',
      tableName: 'labels',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Labels;
};