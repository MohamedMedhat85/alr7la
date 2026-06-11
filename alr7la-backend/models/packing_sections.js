'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PackingSections extends Model {
    static associate(models) {
      PackingSections.belongsTo(models.PackingLists, {
        foreignKey: 'packing_list_id'
      });
      PackingSections.hasMany(models.PackingItems, {
        foreignKey: 'section_id',
        onDelete: 'CASCADE'
      });
    }
  }

  PackingSections.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    packing_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'packing_lists',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'PackingSections',
    tableName: 'packing_sections',
    timestamps: true,
    underscored: true
  });

  return PackingSections;
}; 