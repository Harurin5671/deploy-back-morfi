const { Router } = require("express");
const router = Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

router.get("/products/:id", getProducts);

router.post("/create-product/:id", createProduct);

router.put("/update-product/:id", updateProduct);

router.delete("/delete-product/:id", deleteProduct);

module.exports = router;
