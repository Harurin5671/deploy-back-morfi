const { Router } = require("express");
const userControllers = require("../controllers/users.controller");
// import all controllers

const routes = new Router();

// Add routes
routes.get("/", userControllers.getInfoDb);
routes.get("/:id", userControllers.getInfoById);
routes.put("/banned/:id", userControllers.isBanned);
routes.put("/update/:id", userControllers.userUpdate);
routes.put("/admin/:id", userControllers.isAdmin);
routes.delete("/:id", userControllers.deleteUser);

module.exports = routes;
