const axios = require("axios");
const { Categories } = require("../db");

const getCategories = async (req, res) => {
  try {
    const JSON = require("../Info/Categories.json");
    console.log(
      "🚀 ~ file: categories.controller.js:7 ~ getCategories ~ JSON",
      JSON
    );
    const allCategories = JSON.map((category) => category.name);
    allCategories.forEach((e) => {
      Categories.findOrCreate({
        where: { name: e },
      });
    });
    res.send(allCategories);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getCategories,
};
