'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserBadges extends Model {
    static associate(models) {
      // Define associations
      UserBadges.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      UserBadges.belongsTo(models.Badges, {
        foreignKey: 'badge_id'
      });
    }
  }
  
  UserBadges.init(
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
      badge_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'badges',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: 'UserBadges',
      tableName: 'user_badges',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return UserBadges;
};