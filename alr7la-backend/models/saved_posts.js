'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SavedPosts extends Model {
        static associate(models) {
            // Define associations
            SavedPosts.belongsTo(models.Users, {
                foreignKey: 'user_id'
            });
            SavedPosts.belongsTo(models.Posts, {
                foreignKey: 'post_id'
            });
        }
    }

    SavedPosts.init(
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
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id'
                }
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            }
        },
        {
            sequelize,
            modelName: 'SavedPosts',
            tableName: 'saved_posts',
            timestamps: true,
            underscored: true,  // <- This makes Sequelize use created_at, updated_at
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'post_id']
                }
            ]
        }
    );

    return SavedPosts;
}; 