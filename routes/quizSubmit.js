const express = require("express");
// const verifyToken = require("../Middlewares/Authentication")
const router = express.Router();
const { submitAnswers } = require("../Controller/submitQuizController");
router.post("/submitQuiz",  submitAnswers); 
module.exports = router;    
