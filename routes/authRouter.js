const { signup, login } = require("../Controller/AuthController");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");

const router = require("express").Router();

router.post("/login", (req, res)=>{
    res.send("Login Successful");
})


router.post("/signup", signupValidation, signup)

router.post("/login", loginValidation, login)

module.exports = router;