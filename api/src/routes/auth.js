const { Router } = require("express");
const router = Router();
const { signUp, login, verify } = require("../controllers/auth.controller");
const { checkExistingUser } = require("../middlewares/verifySignUp");
const axios = require("axios");

router.post("/signup", checkExistingUser, signUp);

router.post("/login", login);

router.put("/verify/:uniqueKey", verify);

module.exports = router;
