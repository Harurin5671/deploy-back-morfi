const axios = require("axios");
const { Restaurants, Categories, Users, Products } = require("../db");

const getAllRestaurants = async (req, res) => {
  const getRestaurantsDb = await Restaurants.findAll({
    attributes: ["id", "name", "photo"],
    include: Categories,
  });
  res.send(getRestaurantsDb);
};

const newRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo, categories, descriptions, reviews, products } =
      req.body;
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

const getById = async (req, res) => {
  let { id } = req.params;
  try {
    const restaurant = await Restaurants.findByPk(id, {
      attributes: ["id", "name", "photo"],
      include: [Categories, Products],
    });
    return res.status(200).send(restaurant);
  } catch (error) {
    return res.status(404).json({ error: "Problemas obteniendo ID" });
  }
};

// const postRestaurant = async (req, res) => {
//     let {
//         name,
//         reviews,
//         photo,
//         products,
//         description,
//         categories

//     } = req.body;

//     let exists = await Restaurant.findOne({
//         where: { name: name }
//     })

//     if (exists) return res.status(406).send("El producto ya existe")

//     let restaurantCreate = await Restaurant.create({
//         name,
//         reviews,
//         photo,
//         description,
//     });

//     let categoryDB = await Categories.findAll({
//         where: { name: categories }
//     });

//     await restaurantCreate.addCategory(categoryDB);

//     let productsDB = await Products.findAll({
//         where: { name: products }
//     });

//     await restaurantCreate.addCategory(productsDB);
//     res.status(201).send('Restaurante creado');

// }

// const putRestaurant = async (req, res) => {
//   const selectedRestaurant = await Restaurant.findOne({
//       where: {
//           id: req.params.id
//       }
//   });
//   if (selectedRestaurant) {
//       let data = { ...req.body };

//       let keys = Object.keys(data);

//       keys.forEach(k => {
//           selectedRestaurant[k] = data[k];
//       });

//       await selectedRestaurant.save();
//       res.status(200).send("Restaurante actualizado");
//   } else {
//       res.status(404).send("Error en put Restaurante");
//   };
// };

// const deleteRestaurant = async (req, res) => {
//   const { id } = req.params;
//   try {

//       const deletedRestaurant = await Restaurant.findOne({
//           where: {
//               id: req.params.id
//           }
//       });
//       if (!deletedRestaurant) return 0;
//       await Restaurant.destroy({ where: { id: id } });

//       return res.status(200);
//   }
//   catch (err) {
//       return res.status(500).send(`Restaurant could not be deleted (${err})`);

// }
// }

module.exports = {
  //   allRestaurants,
  getById,
  //   postRestaurant,
  //   putRestaurant,
  //   deleteRestaurant,
  getRestaurantByName,
  getAllRestaurants,
  newRestaurant,
};
