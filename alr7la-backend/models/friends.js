'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Friends extends Model {
    static associate(models) {
      // Define associations
      Friends.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'User'
      });
      Friends.belongsTo(models.Users, {
        foreignKey: 'friend_id',
        as: 'Friend'
      });
    }
  }

  Friends.init(
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
      friend_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      },
      //we should delete rejected friends


      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Friends',
      tableName: 'friends',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );

  return Friends;
};