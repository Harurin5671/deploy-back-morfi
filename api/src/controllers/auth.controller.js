const bcrypt = require("bcrypt");
const { Users } = require("../db");
const emailer = require("../mailer");

const randomString = () => {
  const len = 8;
  let randstr = "";
  for (let i = 0; i < len; i++) {
    const ch = Math.floor(Math.random() * 10 + 1);
    randstr += ch;
  }
  return randstr;
};

const verify = async (req, res) => {
  const { uniqueKey } = req.params;
  console.log(uniqueKey);

  const user = await Users.findOne({
    where: { uniqueKey },
  });
  if (!user) {
    res
      .status(406)
      .json(
        "El codigo de validacion es incorrecto, presiona continuar e intenta registrarte nuevamente."
      );
  } else {
    if (user.isValid === true) {
      res
        .status(400)
        .json(
          "El usuario ya se encuentra validado, presiona continuar e intenta iniciar sesión."
        );
    } else if (user.isValid === false) {
      user.isValid = true;
      const userV = await user.save();
      console.log(userV);
      res.status(200).json("Validado");
    }
  }
};

const signUp = async (req, res) => {
  try {
    const uniqueKey = randomString();
    console.log(uniqueKey, "la unique key");
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
      uniqueKey,
    });
    emailer.sendMail(newUser, uniqueKey);
  } catch (error) {
    console.error("este es el error", error);
  }
};

const login = async (req, res) => {
  try {
    const { user_mail, password } = req.body;
    const userFound = await Users.findOne({
      where: { user_mail },
    });
    if (!userFound) return res.status(400).json("Correo no encontrado.");
    if (userFound.isValid === false)
      return res
        .status(406)
        .json(
          "Su cuenta aun no fue validada, por favor revise su casilla de correos."
        );
    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (!matchPassword) {
      return res.status(401).json("Contraseña incorrecta.");
    }
    res.send("Logueado");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { signUp, login, verify };
