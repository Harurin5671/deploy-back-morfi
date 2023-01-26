const axios = require("axios");
const { Users, Restaurants, Categories } = require("../db");
const bcrypt = require("bcryptjs");

const getInfoDb = async (req, res) => {
  try {
    const dBDeploy = await Users.findAll({
      attributes: [
        "id",
        "name",
        "photo",
        "user_mail",
        "isBanned",
        "isAdmin",
        "createdAt",
        "updatedAt",
        "password",
        "surname",
        "phone",
        "identification",
        "postalCode",
        "street_name",
        "street_number",
      ],
      include: [Restaurants],
    });

    res.status(200).send(dBDeploy);
  } catch (error) {
    console.error(error, "error user.controller");
    res.status(400).send(error);
  }
};
const getInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const infoId = await Users.findByPk(id, {
      include: [{ model: Restaurants }],
    });
    console.log(infoId);
    const userById = await infoId.dataValues;
    res.status(200).send(userById);
  } catch (error) {
    res.status(400).send(error);
  }
};
const isBanned = async (req, res) => {
  const { id } = req.params;

  const userById = await Users.findByPk(id);
  if (userById.isBanned === true) {
    const userUpdated = await Users.update(
      {
        isBanned: false,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send(userUpdated);
  } else {
    const userUpdated = await Users.update(
      {
        isBanned: true,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send(userUpdated);
  }
};
const isAdmin = async (req, res) => {
  const { id } = req.params;
  const userById = await Users.findByPk(id);
  if (userById.isAdmin === true) {
    const userUpdated = await Users.update(
      {
        isAdmin: false,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send(userUpdated);
  } else {
    const userUpdated = await Users.update(
      {
        isAdmin: true,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send(userUpdated);
  }
};
const userUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      user_mail,
      password,
      surname,
      phone,
      identification,
      postalCode,
      street_name,
      street_number,
    } = req.body;
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const userUpdate = await Users.update(
      {
        name: name,
        user_mail: user_mail,
        password: hash,
        surname: surname,
        phone: phone,
        identification: identification,
        postalCode: postalCode,
        street_name: street_name,
        street_number: street_number,
      },
      {
        where: {
          id,
        },
      }
    );
    const userId = await Users.findByPk(id);
    res.status(200).send(userId);
  } catch (error) {
    res.status(400).send(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDelete = await Users.destroy({ where: { id: id } });
    res.send("Eliminado con exito");
  } catch (error) {
    res.status(404).send(error);
  }
};
const userPhotoCloudinary = async (req, res) => {
  try {
    const { id } = req.params;
    const { dataFinal } = req.body;
    console.log(dataFinal, "back undefined");
    const userUpdatedPhoto = await Users.findByPk(id);
    userUpdatedPhoto.photo = dataFinal;
    const saved = await userUpdatedPhoto.save();
    console.log(saved);
    res.status(200).send(saved);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("ERROR");
  }
};

module.exports = {
  getInfoById,
  getInfoDb,
  isBanned,
  userUpdate,
  isAdmin,
  deleteUser,
  userPhotoCloudinary,
};
