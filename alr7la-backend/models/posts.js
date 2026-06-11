'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      // Define associations
      Posts.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });

      Posts.hasMany(models.Comments, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE'
      });

      Posts.hasMany(models.PostsImages, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE'
      });
      Posts.hasMany(models.PostLikes, {
        foreignKey: 'post_id',
        as: 'likes', // optional alias
        onDelete: 'CASCADE'
      });

      Posts.hasMany(models.SavedPosts, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE'
      });
    }
  }

  Posts.init(
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
      description: {
        type: DataTypes.TEXT,
      },
      number_of_likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      visibility: {
        type: DataTypes.ENUM('public', 'private', 'only me'),
      },
      created_at: {
        type: DataTypes.DATE,
      },
      post_source_id: {
        type: DataTypes.INTEGER,
        
      },
    },
    {
      sequelize,
      modelName: 'Posts',
      tableName: 'posts',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );

  return Posts;
};