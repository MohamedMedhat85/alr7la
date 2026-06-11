'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Define associations
      Users.hasMany(models.Posts, {
        foreignKey: 'user_id'
      });

      Users.hasMany(models.Comments, {
        foreignKey: 'user_id'
      });

      Users.belongsToMany(models.Groups, {
        through: models.GroupMembers,
        foreignKey: 'user_id',
        otherKey: 'group_id'
      });

      Users.belongsToMany(models.Badges, {
        through: models.UserBadges,
        foreignKey: 'user_id',
        otherKey: 'badge_id'
      });

      Users.belongsToMany(models.Labels, {
        through: models.Preferences,
        foreignKey: 'user_id',
        otherKey: 'label_id'
      });

      Users.belongsToMany(models.Users, {
        through: models.Friends,
        as: 'UserFriends', // Changed alias from 'Friends' to 'UserFriends'
        foreignKey: 'user_id',
        otherKey: 'friend_id'
      });

      Users.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      });

      Users.hasMany(models.SavedPosts, {
        foreignKey: 'user_id'
      });

      Users.hasMany(models.Reviews, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });

      Users.hasMany(models.UserTrips, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  }

  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      otp: {
        type: DataTypes.STRING(255),
        unique: false,
      },
      otp_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      birth_date: {
        type: DataTypes.DATEONLY,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
      },
      marital_status: {
        type: DataTypes.ENUM('single', 'married', 'divorced'),
        defaultValue: 'single',
      },
      profile_picture: {
        type: DataTypes.TEXT,
      },
      wallpaper: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      country_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'countries',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'users',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );

  return Users;
};
