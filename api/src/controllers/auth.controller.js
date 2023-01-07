const bcrypt = require("bcrypt");
const { Users } = require("../db");

const signUp = async (req, res) => {
  try {
    const { name, photo, user_mail, password } = req.body;
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    if (!name || !user_mail || !password) {
      res.json({ msg: "Please complete all fields" });
    }
    let newUser = await Users.create({
      name,
      photo,
      user_mail,
      password: hash,
    });
    res.json(newUser);
  } catch (error) {
    console.error(error);
  }
};

const login = async (req, res) => {
  try {
    const { user_mail, password } = req.body;
    const userFound = await Users.findOne({
      where: { user_mail },
    });
    if (!userFound) return res.status(400).json("Correo no encontrado.");
    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (!matchPassword) {
      return res.status(401).json("Contraseña incorrecta.");
    }
    res.send("Logueado");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { signUp, login };
