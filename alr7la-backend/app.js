const express = require('express');
const cors = require('cors');

const app = express();
const weatherRouter = require('./routes/weather');
const visaRouter = require('./routes/visa');
const placesRoute = require('./routes/places');
const feedRoute = require('./routes/feed');
const tripRoute = require('./routes/trip');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');
const uploadRoute = require('./routes/upload');
const usersRoute = require('./routes/users');
const friendsRoute = require('./routes/friends');
const visitedCountriesRoute = require('./routes/visitedCountries');
const packingListRoute = require('./routes/packingList');
const countriesRoute = require('./routes/countries');
const reviewsRoute = require('./routes/reviews');
require('./schedulers/currencyScheduler');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use(bodyParser.json({ limit: '100mb' }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/posts', postsRoute);
app.use('/places', placesRoute);
app.use('/auth', authRoute);
app.use('/upload', uploadRoute);
app.use('/comments', commentsRoute);
app.use('/profile', profileRoute);
app.use('/users', usersRoute);
app.use('/weather', weatherRouter);
app.use('/visa', visaRouter);
app.use('/feed', feedRoute);
app.use('/visited-countries', visitedCountriesRoute);
app.use('/upload', uploadRoute);
app.use('/trip', tripRoute);
app.use('/packing-list', packingListRoute);
app.use('/friends', friendsRoute);
app.use('/countries', countriesRoute);
app.use('/reviews', reviewsRoute);
module.exports = app;

