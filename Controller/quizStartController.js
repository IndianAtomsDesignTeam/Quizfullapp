const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

exports.quizStart = async (req, res) => {
  try {
    const { step, selectedClass, subjectName, topicName, difficulty, title, userId, token } = req.body;

    // Step 1: Fetch subjects based on selected class
    if (step === 1 && selectedClass) {
      const subjects = await prisma.curriculum.findMany({
        where: { className: selectedClass },
        distinct: ['subjectName'],
        select: { subjectName: true },
      });
      return res.json(subjects);
    }

    // Step 2: Fetch topics based on selected class and subject
    if (step === 2 && selectedClass && subjectName) {
      const topics = await prisma.curriculum.findMany({
        where: { className: selectedClass, subjectName },
        distinct: ['topicName'],
        select: { topicName: true },
      });
      return res.json(topics);
    }

    // Step 3: Fetch questions and create a session
    if (step === 3 && selectedClass && subjectName && topicName && difficulty && title) {
      
      // ✅ 1. Logged-in User Flow
      if (userId) {
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

        const questions = await prisma.question.findMany({
          where: {
            class: selectedClass,
            subject: subjectName,
            topic: topicName,
            toughness: difficulty,
          },
          take: 20,
          orderBy: { id: 'asc' },
        });

        if (questions.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No questions found for the specified criteria.",
          });
        }

        const session = await prisma.session.create({
          data: {
            userId,
            questions: {
              create: questions.map((q) => ({
                questionId: q.id,
                userId: userId,
              })),
            },
          },
        });

        return res.json({
          success: true,
          sessionId: session.id,
          questions: questions.map((q, index) => ({
            qno: index + 1,
            id: q.id,
            question: q.question,
            optiona: q.optiona,
            optionb: q.optionb,
            optionc: q.optionc,
            optiond: q.optiond,
          })),
        });
      }

      // ✅ 2. Guest User Flow (No guestId required)
      if (!userId) {
        const questions = await prisma.question.findMany({
          where: {
            class: selectedClass,
            subject: subjectName,
            topic: topicName,
            toughness: difficulty,
          },
          take: 20,
          orderBy: { id: 'asc' },
        });

        if (questions.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No questions found for the specified criteria.",
          });
        }

        const guestSession = await prisma.guestSession.create({
          data: {
            guestQuestions: {
              create: questions.map((q) => ({
                questionId: q.id,
              })),
            },
          },
        });

        return res.json({
          success: true,
          sessionId: guestSession.id,
          questions: questions.map((q, index) => ({
            qno: index + 1,
            id: q.id,
            question: q.question,
            optiona: q.optiona,
            optionb: q.optionb,
            optionc: q.optionc,
            optiond: q.optiond,
          })),
        });
      }
    }

    res.status(400).json({ error: "Invalid step or missing required fields." });
  } catch (error) {
    console.error("Error processing quizStart request:", error.message);
    res.status(500).json({ error: "Failed to process request." });
  }
};
