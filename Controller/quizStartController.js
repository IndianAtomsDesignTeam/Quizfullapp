const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.quizStart = async (req, res) => {
  try {
    const { step, selectedClass, subjectName, topicName, difficulty, title, userId } = req.body;

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
    if (step === 3 && selectedClass && subjectName && topicName && difficulty && title && userId) {
      // Fetch questions
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

      // Create a session and map questions
      const session = await prisma.session.create({
        data: {
          userId,
          questions: {
            create: questions.map((q) => ({
              questionId: q.id, // Link the question by ID
              userId: userId, // Link the session to the user
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

    res.status(400).json({ error: "Invalid step or missing required fields." });
  } catch (error) {
    console.error("Error processing quizStart request:", error.message);
    res.status(500).json({ error: "Failed to process request." });
  }
};
