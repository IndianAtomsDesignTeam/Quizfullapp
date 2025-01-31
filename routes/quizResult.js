const express = require("express");
const { quizResult } = require("../Controller/quizResultController");
const router = express.Router();

router.post("/quizResult", quizResult);
module.exports = router;
