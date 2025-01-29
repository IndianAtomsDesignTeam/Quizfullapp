const express = require("express");
const { quizResult } = require("../Controller/quizResultController");
const verifyToken = require("../Middlewares/Authentication")
const router = express.Router();

router.post("/quizResult", verifyToken,  quizResult);
module.exports = router;