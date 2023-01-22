const bcrypt = require("bcrypt");
const { Users, Restaurants } = require("../db");
const emailer = require("../mailer");
const { OAuth2Client } = require("google-auth-library");
const ruta_local = process.env.FRONT_URL || "http://localhost:3000/";
const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
const randomString = () => {
  const len = 8;
  let randstr = "";
  for (let i = 0; i < len; i++) {
    const ch = Math.floor(Math.random() * 10 + 1);
    randstr += ch;
  }
  return randstr;
};

const callbackGoogle = async (req, res) => {
  // Le envio el codigo por query
  try {
    const code = req.query.code;
    console.log(code, "entro a esta funcion");
    //Utilizo el codigo de autorizacion para obtener un token de acceso y un token de refresco, el cual luego de una hora te da un nuevo token de acceso
    await client
      .getToken(code)
      .then((data) => {
        const tokens = data.tokens;
        console.log(data, "lo que recibe");
        res.cookie("access_token", tokens.access_token, {
          httpOnly: false,
          secure: false,
        });
        res.cookie("id_token", tokens.id_token, {
          httpOnly: false,
          secure: false,
        });
      })
      .then(() => res.redirect(ruta_local));
  } catch (err) {
    console.error(err, "el error del callbackGoogle");
  }
};

// const refresh = async (refreshToken) => {
//   // Utilizo el token de refresco para obtener un token de acceso nuevo
//   try {
//     //Como esta funcion se ejecuta en el servidor cada 60 minutos, es importante verificar que se le pase un token de refresco, porque si no se pasa un token de refresco, no hace nada
//     if (refreshToken) {
//       const { tokens } = await client.refreshToken(refreshToken);
//       if (tokens) {
//         console.log(tokens, "EL TOKEN QUE LLEGA");
//         return res.status(200).json({ error: null, tokens });
//       }
//     } else return;
//   } catch (error) {
//     console.error(error, "el error del client.refreshToken");
//     return res.status(400).json({ error: error.message, tokens: null });
//   }
// };

// //Este metodo genera un intervalo que ejecuta cada 60 minutos la funcion refresh
// setInterval(refresh, 60 * 60 * 1000); // refresh token
const private = async (req, res) => {
  const { id_token } = req.query;
  // Verify the access token
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.CLIENT_ID,
  });
  console.log(id_token, "el id token");
  const payload = ticket.getPayload();
  console.log(payload, "lo que devuelve el ingreso");
  // Chequea si el usuario esta autorizado para utilizar la aplicacion via email y token
  if (payload.email_verified) {
    res.json(payload);
  } else {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
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
      include: [{ model: Restaurants }],
    });
    console.log(userFound);
    if (!userFound) return res.status(400).json("Correo no encontrado.");
    // if (userFound.isValid === false)
    //   return res
    //     .status(406)
    //     .json(
    //       "Su cuenta aun no fue validada, por favor revise su casilla de correos."
    //     );
    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (!matchPassword) {
      return res.status(401).json("Contraseña incorrecta.");
    }
    res.send(userFound);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { private, callbackGoogle, signUp, login, verify };
