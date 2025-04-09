const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const generateQuizForTopic = require("../Controller/QuestionGeneration");

// 🔐 Helper: Validate Token
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

// 📋 Helper: Fetch Questions by criteria
const fetchQuestions = async (
  selectedClass,
  subjectName,
  topicName,
  subTopicName,
  difficulty,
  limit = 20
) => {
  const questions = await prisma.$queryRaw`
    SELECT * FROM "question"
    WHERE "class" = ${selectedClass}
      AND "subject" = ${subjectName}
      AND "topic" = ${topicName}
      ${subTopicName ? prisma.sql`AND "subTopic" = ${subTopicName}` : prisma.sql``}
      AND "toughness" = ${difficulty}
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;

  if (!questions.length) {
    throw new Error("No questions found for the specified criteria.");
  }

  return questions.sort((a, b) => a.id - b.id);
};

// 🧾 Helper: Format for response
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

// 🚀 Main Quiz Controller
exports.quizStart = async (req, res) => {
  try {
    const {
      step,
      selectedClass,
      subjectName,
      topicName,
      subTopicName,
      difficulty,
      title,
      userId,
      token,
    } = req.body;

    switch (step) {
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

      case 3:
        if (!selectedClass || !subjectName || !topicName) {
          return res.status(400).json({ error: "Missing fields for Step 3." });
        }
        const subTopics = await prisma.curriculum.findMany({
          where: { className: selectedClass, subjectName, topicName },
          distinct: ["subTopicName"],
          select: { subTopicName: true },
        });
        return res.json(subTopics);

      case 4:
        if (!selectedClass || !subjectName || !topicName || !difficulty || !title) {
          return res.status(400).json({ error: "Missing required fields for Step 4." });
        }

        await generateQuizForTopic(topicName); // Optional AI/content generation hook

        const questions = await fetchQuestions(
          selectedClass,
          subjectName,
          topicName,
          subTopicName,
          difficulty
        );

        let session;

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

      default:
        return res.status(400).json({ error: "Invalid step." });
    }
  } catch (error) {
    console.error("❌ Error processing quizStart:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
