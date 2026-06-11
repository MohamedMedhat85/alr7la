'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostLikes extends Model {
    static associate(models) {
      PostLikes.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      PostLikes.belongsTo(models.Posts, {
        foreignKey: 'post_id'
      });
    }
  }
  
  PostLikes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        }
      },
      reaction_type: {
        type: DataTypes.STRING(20), // 'like', 'love', 'laugh', etc.
        defaultValue: 'like'
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'PostLikes',
      tableName: 'post_likes',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'post_id']
        }
      ]
    }
  );
  
  return PostLikes;
};