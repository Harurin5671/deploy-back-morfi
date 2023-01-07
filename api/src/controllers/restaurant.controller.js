const axios = require('axios');
const urlFromApi = 'https://63b36e9f5901da0ab37f8792.mockapi.io/api/';

const getRestaurants = async (req, res) => {
  try {
    const { data } = await axios.get(urlFromApi + 'restaurant');
    if (data.length <= 0) throw new Error(data);
    let newData= data.map(e=>({...e, rating: e.reviews.length>0 ? (e.reviews.reduce((a, b)=>a+b, 0)/e.reviews.length).toString() : "0.00"}))
    console.log(newData)
    res.send(newData);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status('id is undefined');

  try {
    const { data } = await axios.get(urlFromApi + 'restaurant');
    if (data.length <= 0) throw new Error(data);
    const restaurant = data.find(
      (restaurant) => parseInt(restaurant.id) === parseInt(id)
    );
    if (restaurant.id) {
      return res.send(restaurant);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getRestaurantByName = async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status('name is undefined');

  try {
    const { data } = await axios.get(urlFromApi + 'restaurant');
    if (data.length <= 0) throw new Error(data);
    var array= []
    const restaurant = data.find((restaurant) =>
      restaurant.name.toLowerCase().includes(name.toLowerCase())
    );
    if (restaurant.name) {
      //este array lo hice pq necesito recibir un array en el front
      array.push(restaurant)
      return res.send(array);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  getRestaurantByName,
};
