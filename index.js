const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors")
const QuizStart = require("./routes/QuizStart");
const authRouter = require('./routes/authRouter');

const app = express();
const prisma = new PrismaClient();


// Middleware
app.use(cors()); // Allows requests from the frontend
app.use(express.json());
app.use(authRouter);
app.use(QuizStart);

// Route to fetch all data from class6math
app.get("/class6maths/algebra", async (req, res) => {
  try {
    const questions = await prisma.class6math.findMany({
      where: {topic: "algebra"}
    }); // Fetch all records
    console
    res.json(questions);
  } catch (error) {
    console.error("Error fetching class6math data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/class6math/random", async (req, res) => {
  try {
    const randomQuestions = await prisma.$queryRaw`
      SELECT * 
      FROM class6math 
      WHERE topic = 'Algebra'
      ORDER BY RANDOM() 
      LIMIT 20
    `;
    res.json(randomQuestions);
  } catch (error) {
    console.error("Error fetching random Algebra questions:", error.message);
    res.status(500).json({ error: "Failed to fetch random questions" });
  }
});