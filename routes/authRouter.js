const { signup, login } = require("../Controller/AuthController");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const product = require("./productRouter");


const router = require("express").Router();

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

router.get("/product", product);

module.exports = router;