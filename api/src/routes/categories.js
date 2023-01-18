const { Router } = require("express");
const router = Router();
const { getCategories } = require("../controllers/categories.controller");

router.get("/categories", getCategories);

module.exports = router;
