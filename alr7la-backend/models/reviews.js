'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reviews extends Model {
        static associate(models) {
            // Define associations
            Reviews.belongsTo(models.Users, {
                foreignKey: 'user_id'
            });
            Reviews.belongsTo(models.Places, {
                foreignKey: 'place_id'
            });
        }
    }

    Reviews.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            place_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'places',
                    key: 'id'
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            rating: {
                type: DataTypes.DECIMAL(2, 1),
                allowNull: false,
                validate: {
                    min: 0.0,
                    max: 5.0
                }
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Reviews',
            tableName: 'reviews',
            timestamps: true,
            underscored: true,
        }
    );

    return Reviews;
}; 