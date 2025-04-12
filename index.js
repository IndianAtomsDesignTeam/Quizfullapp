const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const QuizStart = require("./routes/QuizStart");
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");
const submitQuiz = require("./routes/quizSubmit");
const quizResult = require("./routes/quizResult");
const subjectRoutes = require("./routes/processBar");
require("dotenv").config();
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors()); // Allows requests from the frontend
app.use(bodyParser.json());
app.use(express.json());
app.use(authRouter);
app.use(QuizStart);
app.use(submitQuiz);
app.use(quizResult);
app.use("/api", subjectRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
