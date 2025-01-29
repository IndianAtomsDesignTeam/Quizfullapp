const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.quizResult = async (req, res) => {
  try {
    const { userId } = req.body; // Get userId from req.body

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Get the latest submitted session for the user
    const latestSession = await prisma.session.findFirst({
      where: { userId, submitted: true },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: {
          include: {
            question: true, // Include question details
          },
        },
      },
    });

    if (!latestSession) {
      return res.status(404).json({ success: false, message: "No quiz results found for the user." });
    }

    // Format the questions with user answers and correctness
    const formattedQuestions = latestSession.questions.map((q, index) => ({
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
      isCorrect: q.isCorrect,
    }));

    // Return the formatted result
    return res.json({
      success: true,
      sessionId: latestSession.id,
      createdAt: latestSession.createdAt,
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
