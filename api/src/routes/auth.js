const { Router } = require("express");
const router = Router();
const {
  signUp,
  login,
  verify,
  callbackGoogle,
  private,
  refresh,
} = require("../controllers/auth.controller");
const { checkExistingUser } = require("../middlewares/verifySignUp");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
router.post("/signup", checkExistingUser, signUp);
router.post("/login", login);

router.get("/refrescarTokenDeGoogle", refresh);
router.get("/verificacionDeTokensGoogle", private);
router.get("/obtencionDeTokensGoogle", callbackGoogle);

router.put("/verify/:uniqueKey", verify);

module.exports = router;
