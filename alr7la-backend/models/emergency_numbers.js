'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmergencyNumbers extends Model {
    static associate(models) {
      // Define associations
      EmergencyNumbers.belongsTo(models.Countries, {
        foreignKey: 'country_id'
      });
    }
  }
  
  EmergencyNumbers.init(
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
      police: {
        type: DataTypes.STRING(20),
      },
      ambulance: {
        type: DataTypes.STRING(20),
      },
      fire: {
        type: DataTypes.STRING(20),
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'EmergencyNumbers',
      tableName: 'emergency_numbers',
      timestamps: true,
      underscored: true,  // <- This makes Sequelize use created_at, updated_at
    }
  );
  
  return EmergencyNumbers;
};