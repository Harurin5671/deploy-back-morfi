const axios = require("axios");
const { Users, Restaurant, Categories } = require("../db");
const bcrypt = require("bcryptjs");

const getInfoDb = async (req, res) => {
  try {
    const dBDeploy = await Users.findAll({
      attributes: [
        "id",
        "name",
        "photo",
        "user_mail",
        // "isBanned",
        "isAdmin",
        "createdAt",
        "updatedAt",
        "password",
      ],
      include: Restaurant,
    });

    // const users = await dBDeploy.map((user) => {
    //   return {
    //     id:user.id,
    //     name:user.name,
    //     photo:user.photo,
    //     user_mail:user.user_mail,
    //     isBanned:user.isBanned,
    //     isAdmin:user.isAdmin,
    //     createdAt:user.createdAt,
    //     updatedAt:user.updatedAt
    //   }
    // });
    res.status(200).send(dBDeploy);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
const getInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const infoId = await Users.findByPk(id);
    console.log(infoId);
    const userById = await infoId.dataValues;

    // return {
    //   id:user.id,
    //   name:user.name,
    //   photo:user.photo,
    //   user_mail:user.user_mail,
    //   myOrders:user.myOrders,
    //   isAdmin:user.isAdmin,
    //   createdAt:user.createdAt,
    //   updatedAt:user.updatedAt
    // }
    res.status(200).send(userById);
  } catch (error) {
    res.status(400).send(error);
  }
};
const isBanned = async (req, res) => {
  const { id } = req.params;
  try {
    const userById = await Users.findByPk(id);
    console.log(userById);
    if (userById.dataValues.isBanned === false) {
      try {
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
        if (userUpdated) {
          const userFind = await Users.findByPk(id);
          res.status(200).send(userFind);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    } else if (userById.dataValues.isBanned === true) {
      try {
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
        if (userUpdated) {
          const userFind = await Users.findByPk(id);
          res.status(200).send(userFind);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
const isAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userById = await Users.findByPk(id);
    console.log(userById);
    if (userById.dataValues.isAdmin === false) {
      try {
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
        if (userUpdated) {
          const userFind = await Users.findByPk(id);
          res.status(200).send(userFind);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    } else if (userById.dataValues.isAdmin === true) {
      try {
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
        if (userUpdated) {
          const userFind = await Users.findByPk(id);
          res.status(200).send(userFind);
        }
      } catch (error) {
        res.status(400).send(error);
      }
    }
  } catch (error) {}
};
const userUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo, user_mail, password } = req.body;
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const userUpdate = await Users.update(
      {
        name: name,
        photo: photo,
        user_mail: user_mail,
        password: hash,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).send(userUpdate.dataValues);
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

module.exports = {
  getInfoById,
  getInfoDb,
  isBanned,
  userUpdate,
  isAdmin,
  deleteUser,
};
