'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Countries extends Model {
    static associate(models) {
      // Define associations
      Countries.hasMany(models.Places, {
        foreignKey: 'country_id'
      });
      
      Countries.hasMany(models.Users, {
        foreignKey: 'country_id'
      });
      
      Countries.hasMany(models.EmergencyNumbers, {
        foreignKey: 'country_id'
      });
      
      Countries.hasMany(models.ElectricalStandards, {
        foreignKey: 'country_id'
      });
      
      Countries.belongsToMany(models.Currencies, {
        through: 'CountryCurrencies',
        foreignKey: 'country_id',
        otherKey: 'currency_id'
      });
    }
  }
  
  Countries.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      iso_alpha2: {
        type: DataTypes.STRING(2),
        allowNull: false,
        unique: true,
      },
      iso_alpha3: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true,
      },
      numeric_code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true,
      },
      dialing_code: {
        type: DataTypes.STRING(10),
      },
      continent: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      time_zone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      capital: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Countries',
      tableName: 'countries',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return Countries;
};