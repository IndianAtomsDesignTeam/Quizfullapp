const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.submitAnswers = async (req, res) => {
  try {
    const { sessionId, userId, answers } = req.body;

    if (!sessionId || !userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Session ID, user ID, and answers are required.",
      });
    }

    // Fetch the session and validate it exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Session not found or does not belong to the user.",
      });
    }

    // Check if the session is already submitted
    if (session.submitted) {
      return res.status(400).json({
        success: false,
        message: "Quiz has already been submitted for this session.",
      });
    }

    let correctCount = 0;
    let incorrectCount = 0;

    // Process each answer
    const updates = answers.map(async (answer) => {
      console.log("Received answer object:", answer);

      const questionId = answer.questionId; // ✅ Use questionId instead of qno
      const userAnswer = answer.userAnswer;

      if (!questionId) {
        console.error("❌ Missing questionId in answer object:", answer);
        return;
      }

      // Fetch the userQuestion entry
      const userQuestion = await prisma.userQuestion.findFirst({
        where: {
          sessionId,
          userId,
          questionId, // ✅ Use questionId
        },
        include: { question: true },
      });

      if (!userQuestion) {
        console.error(`❌ Invalid questionId: ${questionId}`);
        return;
      }

      // Check if the answer is correct (Ensure userAnswer is valid)
      const isCorrect = userAnswer !== null && userAnswer === userQuestion.question.answer;

      // Update userQuestion with the selected answer and correctness
      await prisma.userQuestion.update({
        where: { id: userQuestion.id },
        data: {
          userAnswer: userAnswer !== undefined ? userAnswer : null, // Ensure null storage
          isCorrect: isCorrect || false, // Default false if incorrect or null
        },
      });

      // Log update results
      console.log(`✅ Updated Q${questionId}: userAnswer = ${userAnswer}, isCorrect = ${isCorrect}`);

      // Update counters
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    // Mark the session as submitted
    await prisma.session.update({
      where: { id: sessionId },
      data: { submitted: true },
    });

    // Return results
    return res.json({
      success: true,
      sessionId,
      correctCount,
      incorrectCount,
      totalQuestions: answers.length,
    });

  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
      error: error.message,
    });
  }
};