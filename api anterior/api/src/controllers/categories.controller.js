const axios = require('axios');
const urlFromApi = 'https://63b36e9f5901da0ab37f8792.mockapi.io/api/';

const getCategories = async (req, res) => {
    try {
      const { data } = await axios.get(urlFromApi + 'category');
      if (data.length <= 0) {
          throw new Error(data);
        }else{
            const allCategories = data.map((category)=>category)
            console.log(allCategories)
            res.status(200).send(allCategories)
        }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  module.exports = {
    getCategories
  };
  