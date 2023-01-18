const axios = require("axios");
const { Products, Restaurants } = require("../db");

const getProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(
      `https://63b36e9f5901da0ab37f8792.mockapi.io/api/restaurant/${id}`
    );
    res.json(data.products);
  } catch (error) {
    console.error(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo, price, description, stock } = req.body;
    if (!name || !photo || !price || !description) {
      res.json({ msg: "Please complete all fields" });
    }
    let newProduct = await Products.create({
      name,
      photo,
      price,
      description,
      restaurantId: id,
      stock,
    });
    console.log(newProduct, "el producto a agregar");
    let restaurant = await Restaurants.findOne({
      where: { id: id },
    });
    const añadirProducto = await restaurant.addProducts(newProduct);
    console.log(añadirProducto, "el añadir producto");
    res.json(newProduct);
  } catch (error) {
    console.error("este es el error", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo, price, description } = req.body;
    const productFound = await Products.findByPk(id);
    if (!name || !photo || !price || !description) {
      res.json({ msg: "Please complete all fields" });
    }
    productFound.name = name;
    productFound.photo = photo;
    productFound.price = price;
    productFound.description = description;
    await productFound.save();
    res.send("Deleteado");
  } catch (error) {
    console.error("este es el error", error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Products.destroy({ where: { id } });
    res.send("Este producto ha sido borrado");
  } catch (error) {
    console.error("este es el error", error);
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
