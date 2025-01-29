const express = require("express");
const { quizStart } = require("../Controller/quizStartController");
const router = express.Router();

router.post("/quizStart",  quizStart)

  module.exports = router;  