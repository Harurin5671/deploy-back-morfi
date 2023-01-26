const axios = require("axios");
const { Restaurants, Categories, Users, Products, Reviews } = require("../db");

const getAllRestaurants = async (req, res) => {
  const getRestaurantsDb = await Restaurants.findAll({
    attributes: ["id", "name", "photo"],
    include: [Categories, Products, Users],
  });
  res.send(getRestaurantsDb);
};
const newRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo, categories, descriptions, reviews, products } =
      req.body;
    console.log("LALALALALAA");
    const infoIdUser = await Users.findByPk(id);
    console.log(infoIdUser, "La info id user");
    const createRestaurant = await Restaurants.create({
      name,
      photo,
      descriptions,
      reviews,
    });
    await categories.forEach(async (category) => {
      let categoriesMatch = await Categories.findOne({
        where: { name: category },
      });

      await createRestaurant.addCategories(categoriesMatch);
    });
    await createRestaurant.addUsers(infoIdUser);
    await infoIdUser.addRestaurant(createRestaurant);
    return res.send(createRestaurant);
  } catch (error) {
    console.log(error, "el error del post restaurant");
    res.status(404).send(error);
  }
};
const getRestaurantByName = async (req, res) => {
  try {
    const { name } = req.query;
    const infoAllRestaurant = await Restaurants.findAll({
      attributes: ["id", "name", "photo"],
      include: Categories,
    });
    if (name) {
      const searchRestaurant = infoAllRestaurant.filter((resto) =>
        resto.name.toLowerCase().includes(name.toLowerCase())
      );
      searchRestaurant.length
        ? res.status(200).json(searchRestaurant)
        : res.status(400).send(searchRestaurant);
    } else {
      res.status(200).json(infoAllRestaurant);
    }
  } catch (error) {
    res.status(404).json({ error: "Problemas obteniendo Todos" });
  }
};
const addReview = async (req, res) => {
  try {
    const { rating, idRestaurante } = req.body;
    const id = idRestaurante;
    const restauranteAEditar = await Restaurants.findByPk(id);
    console.log(restauranteAEditar, "el restaurante a esditar");
    // await restauranteAEditar.addReviews(rating);
    // return res.status(200).send(restauranteAEditar);
    // return res.status(200);
  } catch (err) {
    // console.error(err, "EL ERROR DEL ADDREVIEWASDASD");
    return res.status(200).send(err.message);
  }
};

const getById = async (req, res) => {
  let { id } = req.params;
  try {
    const restaurant = await Restaurants.findByPk(id, {
      attributes: ["id", "name", "photo", "descriptions"],
      include: [Categories, Products],
    });
    return res.status(200).send(restaurant);
  } catch (error) {
    return res.status(404).json({ error: "Problemas obteniendo ID" });
  }
};
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Products.findAll({ where: { restaurantId: id } });
    products.forEach(async (p) => {
      await p.destroy();
    });
    const restaurantDelete = await Restaurants.destroy({ where: { id: id } });
    res.send("Eliminado el Restaurante y sus Productos con exito");
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = {
  getById,
  getRestaurantByName,
  getAllRestaurants,
  newRestaurant,
  deleteRestaurant,
  addReview,
};
