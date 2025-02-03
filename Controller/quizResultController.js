const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken"); // To verify token
const prisma = new PrismaClient();

exports.quizResult = async (req, res) => {
  try {
    const { userId, token, sessionId } = req.body; // Get userId, token, and sessionId

    // ✅ 1. For Logged-in Users (If userId and token are provided)
    if (userId && token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.id !== userId) {
            return res.status(403).json({
              success: false,
              message: "Unauthorized: Invalid token for this user.",
            });
          }

      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid token.",
        });
      }

      // ✅ Fetch the latest submitted session for the user
      const latestSession = await prisma.session.findFirst({
        where: { userId, submitted: true },
        orderBy: { createdAt: "desc" },
        include: {
          questions: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!latestSession) {
        return res.status(404).json({
          success: false,
          message: "No quiz results found for the user.",
        });
      }

      // ✅ Sort and Format Questions
      const formattedQuestions = latestSession.questions
        .sort((a, b) => a.question.id - b.question.id)
        .map((q, index) => ({
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
        sessionId: latestSession.id,
        createdAt: latestSession.createdAt,
        totalQuestions: formattedQuestions.length,
        questions: formattedQuestions,
      });
    }

    // ✅ 2. For Guest Users (If sessionId is provided)
    if (sessionId) {
      const guestSession = await prisma.guestSession.findFirst({
        where: { id: sessionId, submitted: true },
        include: {
          guestQuestions: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!guestSession) {
        return res.status(404).json({
          success: false,
          message: "No quiz results found for the guest user.",
        });
      }

      const formattedQuestions = guestSession.guestQuestions
        .sort((a, b) => a.question.id - b.question.id)
        .map((q, index) => ({
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
        sessionId: guestSession.id,
        createdAt: guestSession.createdAt,
        totalQuestions: formattedQuestions.length,
        questions: formattedQuestions,
      });
    }

    // ❌ If neither userId/token nor sessionId is provided
    return res.status(400).json({
      success: false,
      message: "User ID with token or Session ID is required.",
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
