  const express = require("express");
  const { PrismaClient } = require("@prisma/client");
  const cors = require("cors")
  const QuizStart = require("./routes/QuizStart");
  const authRouter = require('./routes/authRouter');
  const bodyParser = require("body-parser");
  const app = express();
  const prisma = new PrismaClient();


  // Middleware
  app.use(cors()); // Allows requests from the frontend
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(authRouter);
  app.use(QuizStart);
  
  // Route to fetch all data from class6math
  // app.get("/class6maths/algebra", async (req, res) => {
  //   try {
  //     const questions = await prisma.class6math.findMany({
  //       where: {topic: "algebra"}
  //     }); // Fetch all records
  //     console
  //     res.json(questions);
  //   } catch (error) {
  //     console.error("Error fetching class6math data:", error);
  //     res.status(500).json({ error: "Failed to fetch data" });
  //   }
  // });


  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // app.get("/class6math/random", async (req, res) => {
  //   try {
  //     const randomQuestions = await prisma.$queryRaw`
  //       SELECT * 
  //       FROM class6math 
  //       WHERE topic = 'Algebra'
  //       ORDER BY RANDOM() 
  //       LIMIT 20
  //     `;
  //     res.json(randomQuestions);
  //   } catch (error) {
  //     console.error("Error fetching random Algebra questions:", error.message);
  //     res.status(500).json({ error: "Failed to fetch random questions" });
  //   }
  // });

  app.get("/data", async(req, res)=>{
    try {
    // Fetch all curriculum entries
    const curriculums = await prisma.curriculum.findMany();

    // Fetch all questions grouped by class, subject, topic, and difficulty
    const questions = await prisma.question.findMany({
      select: {
        class: true,
        subject: true,
        topic: true,
        toughness: true, // Difficulty level (e.g., "easy", "medium", "hard")
      },
    });

    // Organize questions by class, subject, topic, and difficulty
    const questionsByTopic = questions.reduce((acc, question) => {
      const key = `${question.class}-${question.subject}-${question.topic}`;
      if (!acc[key]) {
        acc[key] = new Set();
      }
      acc[key].add(question.toughness);
      return acc;
    }, {});

    // Iterate through curriculums to find missing questions
    const missingData = curriculums.map((curriculum) => {
      const key = `${curriculum.className}-${curriculum.subjectName}-${curriculum.topicName}`;
      const existingDifficulties = questionsByTopic[key] || new Set();

      // Define all difficulty levels
      const allDifficulties = ["easy", "medium", "hard"];
      const missingDifficulties = allDifficulties.filter(
        (difficulty) => !existingDifficulties.has(difficulty)
      );

      return {
        className: curriculum.className,
        subjectName: curriculum.subjectName,
        topicName: curriculum.topicName,
        missingDifficulties,
      };
    });

    // Filter results to include only entries with missing difficulties
    const results = missingData.filter((entry) => entry.missingDifficulties.length > 0);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching missing questions:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
  });
