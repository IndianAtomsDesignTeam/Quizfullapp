const { Router } = require("express");
const { createUser } = require("../Controller/UserController.js");

const router = Router();

router.post("/", createUser);

module.exports = router;
