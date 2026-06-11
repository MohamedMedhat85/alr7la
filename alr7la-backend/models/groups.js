'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    static associate(models) {
      // Define associations
      Groups.belongsToMany(models.Users, {
        through: models.GroupMembers,
        foreignKey: 'group_id',
        otherKey: 'user_id'
      });
    }
  }
  
  Groups.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      group_name: {
        type: DataTypes.STRING(100),
      },
      description: {
        type: DataTypes.TEXT,
      },
      profile_picture: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Groups',
      tableName: 'groups',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Groups;
};