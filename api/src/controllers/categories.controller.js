const axios = require("axios");
const { Categories } = require("../db");

const getCategories = async (req, res) => {
  try {
    const JSON = require("../info/Categories.json");
    const allCategories = JSON.map((category) => category.name);
    // console.log(typesPokemon)
    allCategories.forEach((e) => {
      Categories.findOrCreate({
        where: { name: e },
      });
    });
    res.send(allCategories);
  } catch (error) {
    res.send("error perro");
  }
};

module.exports = {
  getCategories,
};
