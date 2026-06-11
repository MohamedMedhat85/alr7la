'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      // Define associations
      Comments.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      Comments.belongsTo(models.Posts, {
        foreignKey: 'post_id'
      });
      Comments.hasMany(models.Comments, {
        foreignKey: 'parent_comment_id',
        as: 'replies'
      });
      Comments.belongsTo(models.Comments, {
        foreignKey: 'parent_comment_id',
        as: 'parent'
      });
    }
  }

  Comments.init(
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
      parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'comments', // self-reference
          key: 'id'
        },
        onDelete: 'CASCADE', // Optional: delete replies when parent is deleted
      },
      description: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Comments',
      tableName: 'comments',
      timestamps: true,
      underscored: true,
    }
  );


  return Comments;
};