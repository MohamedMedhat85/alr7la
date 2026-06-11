'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ElectricalStandards extends Model {
    static associate(models) {
      // Define associations
      ElectricalStandards.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      });
    }
  }
  
  ElectricalStandards.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id'
        }
      },
      plug_types: {
        type: DataTypes.STRING(50),
      },
      voltage: {
        type: DataTypes.STRING(20),
      },
      frequency: {
        type: DataTypes.STRING(20),
      },
    },
    {
      sequelize,
      modelName: 'ElectricalStandards',
      tableName: 'electrical_standards',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return ElectricalStandards;
};