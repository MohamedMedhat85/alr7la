'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostsImages extends Model {
    static associate(models) {
      // Define associations
      PostsImages.belongsTo(models.Posts, {
        foreignKey: 'post_id'
      });
    }
  }
  
  PostsImages.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        }
      },
      img_url: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PostsImages',
      tableName: 'posts_images',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return PostsImages;
};