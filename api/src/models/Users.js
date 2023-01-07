const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    user_mail: {
      type: DataTypes.STRING,
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
    myBusinnes: {
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
  });
};
