const { Router } = require('express');
const auth = require('./auth');
const products = require('./products');
const {
  getRestaurants,
  getRestaurantById,
  getRestaurantByName,
} = require('../controllers/restaurant.controller');
const { getCategories } = require('../controllers/categories.controller');
// import all controllers
// import SessionController from './app/controllers/SessionController';

const routes = Router();

// Add routes
routes.get('/restaurants', getRestaurants);
routes.get('/restaurants/:id', getRestaurantById);
routes.get('/restaurant', getRestaurantByName);
routes.use('/', auth);
routes.use('/', products);
routes.use('/categories', getCategories);

module.exports = routes;
