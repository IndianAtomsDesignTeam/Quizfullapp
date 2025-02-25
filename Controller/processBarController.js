const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fetchSubjectProgress(req, res) {
  const userId = req.params.userId;
  const className = req.params.className;

  if (!userId || !className) {
    return res.status(400).json({ error: "Invalid user ID or class name" });
  }

  try {
    console.log(`🔹 Fetching subjects for class: ${className}`);

    // Step 1: Get total unique topics per subject from curriculum
    const totalTopicsPerSubject = await prisma.curriculum.groupBy({
      by: ["subjectName"],
      where: { className: className },
      _count: { topicName: true },
    });

    console.log("✅ Total Topics Per Subject:", totalTopicsPerSubject);

    // Step 2: Get attempted topics per subject
    const attemptedTopics = await prisma.userQuestion.findMany({
      where: { userId: userId },
      include: { question: true },
    });

    console.log("✅ Attempted Topics:", attemptedTopics);

    // Step 3: Extract unique topics attempted by the user
    const attemptedTopicsSet = new Set(attemptedTopics.map((q) => q.question.topic));

    // Step 4: Compute progress per subject
    let totalPercentageSum = 0; // Store sum of percentages for averaging
    let subjectCount = totalTopicsPerSubject.length; // Total subjects counted

    const progress = totalTopicsPerSubject.map((subjectData) => {
      const subjectName = subjectData.subjectName;
      const totalTopics = subjectData._count.topicName;

      // Count topics attempted by the user in this subject
      const attemptedCount = Array.from(attemptedTopicsSet).filter((topic) =>
        attemptedTopics.some((q) => q.question.subject === subjectName && q.question.topic === topic)
      ).length;

      // Calculate percentage progress per subject
      const percentage = totalTopics > 0 ? (attemptedCount / totalTopics) * 100 : 0;

      // Sum up percentages for average calculation
      totalPercentageSum += percentage;

      return {
        subject: subjectName,
        totalTopics,
        attemptedTopics: attemptedCount,
        progressPercentage: percentage.toFixed(2), // Format percentage
      };
    });

    // Step 5: Calculate total average progress across all subjects
    const totalAverageProgress = subjectCount > 0 ? (totalPercentageSum / subjectCount).toFixed(2) : "0.00";

    console.log("✅ Final Progress Data:", progress);
    console.log("📊 Total Average Progress:", totalAverageProgress);

    // Step 6: Send response including total average progress
    res.json({
      subjects: progress,
      totalAverageProgress: totalAverageProgress, // Add total average progress
    });
  } catch (error) {
    console.error("❌ Error fetching subject progress:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
}

module.exports = { fetchSubjectProgress };
