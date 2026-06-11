'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CountryCurrencies extends Model {
    static associate(models) {
      // Define associations
      CountryCurrencies.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      });
      CountryCurrencies.belongsTo(models.Currencies, {
        foreignKey: 'currency_id'
      });
    }
  }
  
  CountryCurrencies.init(
    {
      country_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id'
        }
      },
      currency_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'id'
        }
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      sequelize,
      modelName: 'CountryCurrencies',
      tableName: 'country_currencies',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return CountryCurrencies;
};