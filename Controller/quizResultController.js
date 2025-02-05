const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// ✅ Helper Functions
const calculateStreak = (questions) => {
  let maxStreak = 0, currentStreak = 0;
  questions.forEach((q) => {
    if (q.isCorrect) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  return maxStreak;
};

const calculateAccuracy = (correctAnswers, totalQuestions) => {
  return ((correctAnswers / totalQuestions) * 100).toFixed(2);
};

const calculateAchievement = (accuracy, streak) => {
  const bonus = streak >= 5 ? 5 : 0;
  return (parseFloat(accuracy) + bonus).toFixed(2);
};

const calculatePace = (totalQuestions, timeTakenInSeconds) => {
  const timeInMinutes = timeTakenInSeconds / 60;
  return (totalQuestions / timeInMinutes).toFixed(2);
};

const sortQuestions = (questions) => {
  return questions.sort((a, b) => a.question.id - b.question.id);
};

// ✅ Controller: Quiz Result
exports.quizResult = async (req, res) => {
  try {
    const { userId, token, sessionId } = req.body;
    let session, questions, sessionType;

    // ✅ 1. For Logged-in Users
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

    // ✅ 2. For Guest Users
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

    // ✅ Check if Metrics Already Exist
    if (session.streak !== null && session.pace !== null && session.achievement !== null && session.accuracy !== null) {
      return res.json({
        success: true,
        sessionId: session.id,
        createdAt: session.createdAt,
        totalQuestions: questions.length,
        streak: session.streak,
        pace: session.pace,
        achievement: session.achievement,
        accuracy: session.accuracy,
        questions: sortQuestions(questions).map((q, index) => ({
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
          explanation: q.question.explaination,  // ✅ Added Explanation
          userAnswer: q.userAnswer || "Not Answered",
          isCorrect: q.isCorrect ?? false,
        })),
      });
    }

    // ✅ Apply Sorting
    const sortedQuestions = sortQuestions(questions);

    // ✅ Calculate Metrics if Not Stored Yet
    const correctAnswers = sortedQuestions.filter((q) => q.isCorrect).length;
    const totalQuestions = sortedQuestions.length;
    const streak = calculateStreak(sortedQuestions);
    const accuracy = calculateAccuracy(correctAnswers, totalQuestions);
    const achievement = calculateAchievement(accuracy, streak);
    const pace = calculatePace(totalQuestions, session.timeTaken || 600); // Default to 10 mins if not provided

    // ✅ Store Metrics in DB
    await prisma[sessionType].update({
      where: { id: session.id },
      data: {
        streak,
        pace: parseFloat(pace),
        achievement: parseFloat(achievement),
        accuracy: parseFloat(accuracy),
      },
    });

    // ✅ Format Questions for Response
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
      explanation: q.question.explaination,  // ✅ Added Explanation
      userAnswer: q.userAnswer || "Not Answered",
      isCorrect: q.isCorrect ?? false,
    }));

    return res.json({
      success: true,
      message: "Metrics calculated and stored successfully.",
      sessionId: session.id,
      createdAt: session.createdAt,
      totalQuestions,
      streak,
      pace,
      achievement,
      accuracy,
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
