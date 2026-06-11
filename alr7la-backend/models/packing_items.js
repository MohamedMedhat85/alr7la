'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PackingItems extends Model {
    static associate(models) {
      PackingItems.belongsTo(models.PackingSections, {
        foreignKey: 'section_id'
      });
    }
  }

  PackingItems.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'packing_sections',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_packed: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'PackingItems',
    tableName: 'packing_items',
    timestamps: true,
    underscored: true
  });

  return PackingItems;
}; 