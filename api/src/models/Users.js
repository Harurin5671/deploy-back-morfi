const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },

    photo: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    user_mail: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    notification: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    myOrders: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    favorites: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isValid: { type: DataTypes.BOOLEAN, defaultValue: false },
    uniqueKey: { type: DataTypes.STRING },

    surname: {
      type: DataTypes.STRING,
      defaultValue: null,
      unique: false,
      allowNull: true,
    },
    phone: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      unique: false,
      allowNull: true,
    },
    identification: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    postalCode: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
      unique: false,
    },
    street_name: {
      type: DataTypes.STRING,
      defaultValue: null,
      unique: false,
    },
    street_number: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      unique: false,
    },
  });
};
