'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VisitedCountries extends Model {
    static associate(models) {
      // Define associations
      VisitedCountries.belongsTo(models.Users, {
        foreignKey: 'user_id'
      });
      VisitedCountries.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      });
    }
  }
  
  VisitedCountries.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      country_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id'
        }
      },
      visit_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'VisitedCountries',
      tableName: 'visited_countries',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return VisitedCountries;
};