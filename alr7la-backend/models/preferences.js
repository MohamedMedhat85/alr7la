'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Preferences extends Model {
    static associate(models) {
      // Define associations
      Preferences.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Preferences.belongsTo(models.Labels, {
        foreignKey: 'label_id'
      });
    }
  }
  
  Preferences.init(
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
      modelName: 'Preferences',
      tableName: 'preferences',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Preferences;
};