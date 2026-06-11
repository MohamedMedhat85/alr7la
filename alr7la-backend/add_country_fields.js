const { Sequelize } = require('sequelize');
const config = require('./config/config.json');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    logging: false
  }
);

async function addCountryFields() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Add the new columns to the countries table
    const alterQueries = [
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS continent VARCHAR(50)',
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS language VARCHAR(100)',
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS time_zone VARCHAR(50)',
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS capital VARCHAR(100)',
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS summary TEXT',
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8)',
      'ALTER TABLE countries ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8)'
    ];

    for (const query of alterQueries) {
      try {
        await sequelize.query(query);
        console.log(`Successfully executed: ${query}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`Column already exists: ${query}`);
        } else {
          console.error(`Error executing: ${query}`, error.message);
        }
      }
    }

    // Update some sample data for testing
    const updateQueries = [
      `UPDATE countries SET 
        continent = 'Europe', 
        language = 'Greek', 
        time_zone = 'UTC+2', 
        capital = 'Athens', 
        summary = 'Greece is a country in southeastern Europe with thousands of islands throughout the Aegean and Ionian seas. Influential in ancient times, it\'s often called the cradle of Western civilization.',
        latitude = 39.0742,
        longitude = 21.8243
       WHERE id = 67`,
      
      `UPDATE countries SET 
        continent = 'Asia', 
        language = 'Japanese', 
        time_zone = 'UTC+9', 
        capital = 'Tokyo', 
        summary = 'Japan is an island country in East Asia. Located in the Pacific Ocean, it lies off the eastern coast of the Asian continent and stretches from the Sea of Okhotsk in the north to the East China Sea and China in the southwest.',
        latitude = 35.6762,
        longitude = 139.6503
       WHERE id = 1`
    ];

    for (const query of updateQueries) {
      try {
        await sequelize.query(query);
        console.log(`Successfully updated sample data`);
      } catch (error) {
        console.error(`Error updating sample data:`, error.message);
      }
    }

    console.log('All operations completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

addCountryFields(); 