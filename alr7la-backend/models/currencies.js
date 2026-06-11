'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currencies extends Model {
    static associate(models) {
      // Define associations
      Currencies.belongsToMany(models.Countries, {
        through: 'CountryCurrencies',
        foreignKey: 'currency_id',
        otherKey: 'country_id'
      });
    }
  }
  
  Currencies.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      exchange_rate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Currencies',
      tableName: 'currencies',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Currencies;
};