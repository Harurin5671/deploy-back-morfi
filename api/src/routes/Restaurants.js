const { Router } = require("express");

// import all controllers

const controllerRestaurants = require("../controllers/restaurant.controller");

const routes = new Router();

// Add routes
routes.get("/", controllerRestaurants.getAllRestaurants);

routes.get("/:id", controllerRestaurants.getById);

routes.post("/:id", controllerRestaurants.newRestaurant);

routes.get("/name/getbyname", controllerRestaurants.getRestaurantByName);

// routes.post('/', controllerRestaurants.postRestaurant)

// routes.put('/:id', controllerRestaurants.putRestaurant)

module.exports = routes;
