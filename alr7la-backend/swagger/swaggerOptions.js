module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alr7la API',
      version: '1.0.0',
      description: 'API documentation for Alr7la Node.js backend'
    },
    servers: [
      {
        url: 'https://alr7la-backend-production.up.railway.app/'
      }
    ]
  },
  apis: ['./swagger/swagger.yaml'], // use YAML file
};