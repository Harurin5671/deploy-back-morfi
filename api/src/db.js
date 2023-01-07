require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  PGUSER,
  PGPASSWORD,
  PGHOST,
  PGPORT,
  PGDATABASE,
} = process.env;

const sequelize = new Sequelize(
  `postgresql://${ PGUSER }:${ PGPASSWORD }@${ PGHOST }:${ PGPORT }/${ PGDATABASE }`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Users, Products, MyOrders, Restaurant, Favorites, Categories, Review } =
  sequelize.models;

// Aca vendrian las relaciones
// Un usuario puede tener muchas ordenes y muchas ordenes van a hacer de un Usuario
Users.hasMany(MyOrders);
MyOrders.belongsTo(Users);

// Aca vendrian las relaciones
// Un Usuario puede tener muchos Favoritos y muchas Favoritos van a hacer de un Usuario
Users.hasMany(Favorites);
Favorites.belongsTo(Users);

// Aca vendrian las relaciones
// Un Restaurant puede tener muchas Ordenes y muchas Ordenes van a hacer de un Restaurante
Restaurant.hasMany(MyOrders);
MyOrders.belongsTo(Restaurant);

// Aca vendrian las relaciones
// Un Restaurant puede tener muchas Review y muchas Review van a hacer de un Restaurante
Restaurant.hasMany(Review);
Review.belongsTo(Restaurant);

//APROBAR
Restaurant.hasMany(Categories);
Categories.belongsTo(Restaurant);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
