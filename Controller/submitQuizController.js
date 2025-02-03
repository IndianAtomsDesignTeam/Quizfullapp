const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.submitAnswers = async (req, res) => {
  try {
    const { sessionId, userId, answers, timeTaken } = req.body;

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Session ID and answers are required.",
      });
    }

    if (typeof timeTaken !== "number" || timeTaken < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid timeTaken value. It must be a positive number (in seconds).",
      });
    }

    let session;

    // ✅ 1. Handling Submission for Logged-in Users
    if (userId) {
      session = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: "Session not found or does not belong to the user.",
        });
      }

      if (session.submitted) {
        return res.status(400).json({
          success: false,
          message: "Quiz has already been submitted for this session.",
        });
      }
    } 
    // ✅ 2. Handling Submission for Guest Users
    else {
      session = await prisma.guestSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Guest session not found.",
        });
      }

      if (session.submitted) {
        return res.status(400).json({
          success: false,
          message: "Quiz has already been submitted for this guest session.",
        });
      }
    }

    let correctCount = 0;
    let incorrectCount = 0;

    // ✅ Process each answer
    const updates = answers.map(async (answer) => {
      const { questionId, userAnswer } = answer;

      if (!questionId) {
        console.error("❌ Missing questionId in answer object:", answer);
        return;
      }

      // Fetch the corresponding userQuestion or guestUserQuestion
      const questionEntry = userId
        ? await prisma.userQuestion.findFirst({
            where: { sessionId, userId, questionId },
            include: { question: true },
          })
        : await prisma.guestUserQuestion.findFirst({
            where: { sessionId, questionId },
            include: { question: true },
          });

      if (!questionEntry) {
        console.error(`❌ Invalid questionId: ${questionId}`);
        return;
      }

      // Check correctness
      const isCorrect = userAnswer !== null && userAnswer === questionEntry.question.answer;

      // ✅ Update userQuestion or guestUserQuestion
      await (userId
        ? prisma.userQuestion.update({
            where: { id: questionEntry.id },
            data: {
              userAnswer: userAnswer !== undefined ? userAnswer : null,
              isCorrect: isCorrect || false,
            },
          })
        : prisma.guestUserQuestion.update({
            where: { id: questionEntry.id },
            data: {
              userAnswer: userAnswer !== undefined ? userAnswer : null,
              isCorrect: isCorrect || false,
            },
          }));

      // ✅ Update counters
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    // ✅ Mark the session as submitted and store timeTaken
    await (userId
      ? prisma.session.update({
          where: { id: sessionId },
          data: { submitted: true, timeTaken: timeTaken },
        })
      : prisma.guestSession.update({
          where: { id: sessionId },
          data: { submitted: true, timeTaken: timeTaken },
        }));

    // ✅ Return the results
    return res.json({
      success: true,
      sessionId,
      correctCount,
      incorrectCount,
      totalQuestions: answers.length,
      timeTaken, // Include time taken in the response
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
  