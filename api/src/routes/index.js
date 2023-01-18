const { Router } = require("express");
const auth = require("./auth");
const restaurantRoute = require("./Restaurants");
const userRoute = require("./Users");
const products = require("./products");
const categories = require("./categories")
const mercadoPago = require("./mercadoPago")

// import all controllers
// import SessionController from './app/controllers/SessionController';

const router = new Router();

// Add routes
router.use("/restaurants", restaurantRoute);
router.use("/users", userRoute);
router.use("/", products);
router.use("/", auth);
router.use("/", categories);
router.use("/", mercadoPago);

module.exports = router;
