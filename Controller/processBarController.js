const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fetchSubjectProgress(req, res) {
  const userId = req.params.userId;
  const className = req.params.className;

  if (!userId || !className) {
    return res.status(400).json({ error: "Invalid user ID or class name" });
  }

  try {
    // Step 1: Get total unique topics per subject for the given class from curriculum
    const totalTopicsPerSubject = await prisma.curriculum.groupBy({
      by: ["subjectName"],
      where: { className: className }, // Filter by class
      _count: { topicName: true }, // Count distinct topics per subject
    });

    // Step 2: Get attempted topics per subject (topics where the user attempted at least one question)
    const attemptedTopics = await prisma.userQuestion.findMany({
      where: { userId: userId },
      include: { question: true }, // Include question details
    });

    // Step 3: Extract unique topics attempted by the user
    const attemptedTopicsSet = new Set(attemptedTopics.map((q) => q.question.topic));

    // Step 4: Compute progress per subject
    const progress = totalTopicsPerSubject.map((subjectData) => {
      const subjectName = subjectData.subjectName;
      const totalTopics = subjectData._count.topicName;

      // Count topics attempted by the user in this subject
      const attemptedCount = Array.from(attemptedTopicsSet).filter((topic) =>
        attemptedTopics.some((q) => q.question.subject === subjectName && q.question.topic === topic)
      ).length;

      // Calculate percentage
      const percentage = totalTopics > 0 ? (attemptedCount / totalTopics) * 100 : 0;

      return {
        subject: subjectName,
        totalTopics,
        attemptedTopics: attemptedCount,
        progressPercentage: percentage.toFixed(2), // Format percentage
      };
    });

    res.json(progress);
  } catch (error) {
    console.error("Error fetching subject progress:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
}

module.exports = { fetchSubjectProgress };
