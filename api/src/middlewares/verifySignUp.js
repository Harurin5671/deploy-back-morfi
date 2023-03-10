const { Users } = require("../db");

const checkExistingUser = async (req, res, next) => {
  try {
    const email = await Users.findOne({
      where: { user_mail: req.body.user_mail },
    });
    if (email)
      return res.status(400).json({ message: "The email already exists" });
    next();
  } catch (error) {
    console.log(error, "el error del checkExistingUser");
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkExistingUser };
