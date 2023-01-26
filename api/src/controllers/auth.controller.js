const bcrypt = require("bcrypt");
const { Users, Restaurants } = require("../db");
const emailer = require("../mailer");
const { OAuth2Client } = require("google-auth-library");
console.log(process.env.CLIENT_ID, "EL ID");
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
        console.log(data.tokens, "lo que recibe el callbackGoogle");
        if (tokens.refresh_token !== undefined) {
          res.cookie("refresh_token", tokens.refresh_token, {
            httpOnly: false,
            secure: false,
          });
        }
        res.cookie("access_token", tokens.access_token, {
          httpOnly: false,
          secure: false,
        });
        res.cookie("id_token", tokens.id_token, {
          httpOnly: false,
          secure: false,
        });
      })
      .then(() => res.redirect("http://localhost:3000"));
  } catch (err) {
    console.error(err, "el error del callbackGoogle");
  }
};
const refresh = async (refreshToken) => {
  // Utilizo el token de refresco para obtener un token de acceso nuevo
  try {
    //Como esta funcion se ejecuta en el servidor cada 60 minutos, es importante verificar que se le pase un token de refresco, porque si no se pasa un token de refresco, no hace nada
    if (refreshToken) {
      const { tokens } = await client.refreshToken(refreshToken);
      console.log(
        tokens,
        "los tokens que devuelve con el refreshToken el metodo refresh"
      );
      if (tokens) {
        // console.log(tokens, "EL TOKEN QUE LLEGA");
        if (tokens.refresh_token !== undefined) {
          res.cookie("refresh_token", tokens.refresh_token, {
            httpOnly: false,
            secure: false,
          });
        }
        res.cookie("access_token", tokens.access_token, {
          httpOnly: false,
          secure: false,
        });
        res.cookie("id_token", tokens.id_token, {
          httpOnly: false,
          secure: false,
        });

        return res.status(200).json({ error: null, tokens });
      }
    } else return;
  } catch (error) {
    console.error(error, "el error del client.refreshToken");
    return res.status(400).json({ error: error.message, tokens: null });
  }
};
const private = async (req, res) => {
  const { id_token } = req.query;
  // Verify the access token
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    });
    // console.log(id_token, "el id token");
    const userDeGoogle = ticket.getPayload();
    console.log(
      userDeGoogle,
      "lo que devuelve el payload en el metodo private"
    );
    const emailDeUserDeGoogle = userDeGoogle.email;
    const userEnDb = await Users.findOne({
      where: { user_mail: emailDeUserDeGoogle },
      include: [{ model: Restaurants }],
    });
    console.log(
      userEnDb,
      "el user que encuentro en la db, si no existe no encuentra"
    );
    if (userEnDb) {
      res.json(userEnDb);
    } else if (userDeGoogle.email_verified && !userEnDb) {
      // Chequea si el usuario esta autorizado para utilizar la aplicacion via email y token
      res.json(userDeGoogle);
    } else {
      res.status(401).json({ message: "Usuario no autorizado" });
    }
  } catch (err) {
    console.error(err, "el error del metodo private");
    res.status(400).send(null);
  }
};

const verify = async (req, res) => {
  const { uniqueKey } = req.params;

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
    // console.log(uniqueKey, "la unique key");
    const {
      name,
      photo,
      user_mail,
      password,
      surname,
      phone,
      identification,
      postalCode,
      street_name,
      street_number,
    } = req.body;
    // const salt = 10;
    // const hash = await bcrypt.hash(password, salt);
    if (
      !name ||
      !user_mail ||
      !password ||
      !surname ||
      !phone ||
      !identification ||
      !postalCode ||
      !street_name ||
      !street_number
    ) {
      res.json({ msg: "Please complete all fields" });
    }
    let newUser = await Users.create({
      name,
      photo,
      user_mail,
      password,
      uniqueKey,
      surname,
      phone,
      identification,
      postalCode,
      street_name,
      street_number,
    });
    await emailer.sendMail(newUser, uniqueKey);
    if (newUser) {
      console.log(newUser, "el new user");
      return res.json(newUser);
    }
  } catch (error) {
    console.log(error);
    console.error("este es el error", error.message);
    return res.status(400).send(`${error.message}`);
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
    // const matchPassword = await bcrypt.compare(password, userFound.password);
    // if (!matchPassword) {
    //   return res.status(401).json("Contraseña incorrecta.");
    // }
    const userParaEnviarAlFront = [{ ...userFound.dataValues, password: null }];
    console.log(userParaEnviarAlFront, "los data values");
    res.send(userParaEnviarAlFront);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { refresh, private, callbackGoogle, signUp, login, verify };
