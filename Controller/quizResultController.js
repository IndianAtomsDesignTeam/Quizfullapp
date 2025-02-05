const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

//Helper: Sort Questions by questionId
const sortQuestions = (questions) => {
  return questions.sort((a, b) => a.question.id - b.question.id);
};

exports.quizResult = async (req, res) => {
  try {
    const { userId, token, sessionId } = req.body;
    let session, questions, sessionType;

    //1. For Logged-in Users
    if (userId && token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized: Invalid token for this user." });
      }

      session = await prisma.session.findFirst({
        where: { userId, submitted: true },
        orderBy: { createdAt: "desc" },
        include: { questions: { include: { question: true } } },
      });

      if (!session) {
        return res.status(404).json({ success: false, message: "No quiz results found for the user." });
      }
      questions = session.questions;
      sessionType = "session";
    }

    //2. For Guest Users
    if (sessionId && !userId) {
      session = await prisma.guestSession.findFirst({
        where: { id: sessionId, submitted: true },
        include: { guestQuestions: { include: { question: true } } },
      });

      if (!session) {
        return res.status(404).json({ success: false, message: "No quiz results found for the guest user." });
      }
      questions = session.guestQuestions;
      sessionType = "guestSession";
    }

    if (!session || !questions) {
      return res.status(400).json({ success: false, message: "User ID with token or Session ID is required." });
    }

    //Apply Sorting
    const sortedQuestions = sortQuestions(questions);

    //Format Questions for Response
    const formattedQuestions = sortedQuestions.map((q, index) => ({
      questionId: q.question.id,
      qno: index + 1,
      question: q.question.question,
      options: {
        A: q.question.optiona,
        B: q.question.optionb,
        C: q.question.optionc,
        D: q.question.optiond,
      },
      correctAnswer: q.question.answer,
      userAnswer: q.userAnswer || "Not Answered",
      isCorrect: q.isCorrect ?? false,
    }));

    return res.json({
      success: true,
      sessionId: session.id,
      createdAt: session.createdAt,
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("Error fetching quiz result:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz results.",
      error: error.message,
    });
  }
};
