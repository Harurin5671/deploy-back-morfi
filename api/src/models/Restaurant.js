const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Restaurants",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.TEXT,
        defaultValue: false,
      },
      reviews: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      categories: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
      },
      products: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
      },
      descriptions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    { timestamps: false }
  );
};
