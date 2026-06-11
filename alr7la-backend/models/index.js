'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const mysql2 = require('mysql2/promise');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// sequelize instance
const sequelize = new Sequelize('u146721022_alr7la', 'u146721022_alr7la', 'm$6TM15f2', {
  host: 'srv2000.hstgr.io',
  port: '3306',
  dialect: 'mysql',

  pool: {
    max: 5,       // reduce max connections to avoid hitting limit
    min: 0,
    idle: 10000,  // close idle connections after 10 seconds
    acquire: 30000,
    evict: 10000, // remove idle connections after 10 seconds
  },

  retry: {
    max: 3,  // number of retry attempts on failure
    match: [
      /Deadlock/i,
      /Connection.*lost/i,
      /SequelizeConnectionError/i,
      /SequelizeConnectionRefusedError/i,
      /SequelizeHostNotFoundError/i,
      /SequelizeHostNotReachableError/i,
      /SequelizeInvalidConnectionError/i,
      /SequelizeConnectionTimedOutError/i,
      /ER_CON_COUNT_ERROR/,               // <-- match max connection error
      /ER_USER_LIMIT_REACHED/,
      /ER_TOO_MANY_USER_CONNECTIONS/,
    ],
    backoffBase: 100,  // initial backoff duration in ms
    backoffExponent: 1.5, // exponential backoff multiplier
  },
});


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sync the models with the database, creating tables if they do not exist
sequelize.sync({ force: false })  // `force: false` ensures tables are only created if they do not exist
  .then(() => {
    console.log('Database & tables have been created!');
  })
  .catch(err => {
    console.error('Error creating database tables:', err);
  });

module.exports = db;
