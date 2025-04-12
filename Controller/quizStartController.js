const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const generateQuizForTopic = require("../Controller/QuestionGeneration");

// 🔐 Token Validator
const validateToken = (token, userId) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== userId) {
      throw new Error("Unauthorized: Invalid token for this user.");
    }
    return true;
  } catch (error) {
    throw new Error("Unauthorized: Invalid token.");
  }
};

// 🧠 Fetch Questions (still using old question schema)
const fetchQuestions = async (
  selectedClass,
  subjectName,
  topicName,
  difficulty,
  limit = 20
) => {
  const questions = await prisma.$queryRaw`
    SELECT * FROM "question"
    WHERE "class" = ${selectedClass}
      AND "subject" = ${subjectName}
      AND "topic" = ${topicName}
      AND "toughness" = ${difficulty}
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;

  if (!questions.length) {
    throw new Error("No questions found for the specified criteria.");
  }

  return questions.sort((a, b) => a.id - b.id);
};

// 🎁 Format Questions
const formatQuestions = (questions) =>
  questions.map((q, index) => ({
    qno: index + 1,
    id: q.id,
    question: q.question,
    optiona: q.optiona,
    optionb: q.optionb,
    optionc: q.optionc,
    optiond: q.optiond,
  }));

// 🚀 Quiz Start Controller (3-Step Flow)
exports.quizStart = async (req, res) => {
  try {
    const {
      step,
      selectedClass,
      subjectName,
      topicName,
      difficulty,
      title,
      userId,
      token,
    } = req.body;

    switch (step) {
      // Step 1: Get Subjects
      case 1:
        if (!selectedClass) {
          return res.status(400).json({ error: "Class is required for Step 1." });
        }

        const subjects = await prisma.curriculum.findMany({
          where: { className: selectedClass },
          distinct: ["subjectName"],
          select: { subjectName: true },
        });
        return res.json(subjects);

      // Step 2: Get Topics
      case 2:
        if (!selectedClass || !subjectName) {
          return res.status(400).json({ error: "Class and Subject are required for Step 2." });
        }

        const topics = await prisma.curriculum.findMany({
          where: { className: selectedClass, subjectName },
          distinct: ["topicName"],
          select: { topicName: true },
        });
        return res.json(topics);

      // Step 3: Generate Quiz
      case 3:
        if (!selectedClass || !subjectName || !topicName || !difficulty || !title) {
          return res.status(400).json({ error: "Missing required fields for Step 3." });
        }

        await generateQuizForTopic(topicName); // Optional logic

        const questions = await fetchQuestions(
          selectedClass,
          subjectName,
          topicName,
          difficulty
        );

        let session;

        // Logged-in user
        if (userId) {
          validateToken(token, userId);

          session = await prisma.session.create({
            data: {
              userId,
              questions: {
                create: questions.map((q) => ({
                  questionId: q.id,
                  userId,
                })),
              },
            },
          });
        } else {
          // Guest user
          session = await prisma.guestSession.create({
            data: {
              guestQuestions: {
                create: questions.map((q) => ({
                  questionId: q.id,
                })),
              },
            },
          });
        }

        return res.json({
          success: true,
          sessionId: session.id,
          questions: formatQuestions(questions),
        });

      // Invalid Step
      default:
        return res.status(400).json({ error: "Invalid step." });
    }
  } catch (error) {
    console.error("❌ Error processing quizStart:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
