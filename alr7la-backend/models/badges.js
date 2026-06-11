'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Badges extends Model {
    static associate(models) {
      // Define associations
      Badges.belongsToMany(models.Users, {
        through: models.UserBadges,
        foreignKey: 'badge_id',
        otherKey: 'user_id'
      });
    }
  }
  
  Badges.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      badge_name: {
        type: DataTypes.STRING(100),
      },
      badge_description: {
        type: DataTypes.TEXT,
      },
      badge_picture: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Badges',
      tableName: 'badges',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Badges;
};