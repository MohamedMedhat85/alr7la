const http = require('http');
const port = 3000;
const app = require('./app');
const db = require('./models');  // Import models to trigger database sync

db.sequelize.sync({ force: false })  // Sync models with the database
  .then(() => {
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
