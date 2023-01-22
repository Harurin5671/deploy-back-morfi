const mercadopago = require("mercadopago");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const ruta_local = process.env.FRONT_URL || "http://localhost:3000/";

const crearOrden = async (req, res) => {
  //   const { quantity, priceTotal, id } = req.body;
  const { data } = req.body;
  mercadopago.configure({
    access_token: ACCESS_TOKEN,
  });

  let preference = {
    items: [],
    back_urls: {
      success: `${ruta_local}`, //ver ${ruta_local}${id}?purchasedQuantity=${quantity}
      failure: `${ruta_local}`,
      pending: `${ruta_local}`,
    },
    auto_return: "approved",
    payment_methods: {
      installments: 1,
    },
  };
  data.forEach((el) =>
    preference.items.push({
      title: el.name,
      quantity: el.quantity,
      currency_id: "ARS",
      unit_price: el.price,
    })
  );
  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.json(response.body.init_point);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  crearOrden,
};
