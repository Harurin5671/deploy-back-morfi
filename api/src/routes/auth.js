const { Router } = require("express");
const router = Router();
const {
  signUp,
  login,
  verify,
  callbackGoogle,
  private,
} = require("../controllers/auth.controller");
const { checkExistingUser } = require("../middlewares/verifySignUp");

router.post("/signup", checkExistingUser, signUp);
router.post("/login", login);

router.get("/verificacionDeTokensGoogle", private);
router.get("/obtencionDeTokensGoogle", callbackGoogle);

router.put("/verify/:uniqueKey", verify);

module.exports = router;
