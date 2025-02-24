const express = require("express");
const { fetchSubjectProgress } = require("../Controller/processBarController");

const router = express.Router();

// Route to get subject progress for a specific user & class
router.get("/subject-progress/:userId/:className", fetchSubjectProgress);

module.exports = router;
