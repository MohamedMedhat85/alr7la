'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMembers extends Model {
    static associate(models) {
      // Define associations
      GroupMembers.belongsTo(models.Groups, {
        foreignKey: 'group_id'
      });
      GroupMembers.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
    }
  }
  
  GroupMembers.init(
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id'
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: 'GroupMembers',
      tableName: 'group_members',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return GroupMembers;
};