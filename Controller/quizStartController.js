const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.quizStart = async (req, res)=>{
    try {
      const { step, selectedClass, subjectName, topicName } = req.body;
  
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
          where: { className: selectedClass, subjectName: subjectName },
          distinct: ['topicName'],
          select: { topicName: true },
        });
        return res.json(topics);
      }
  
      if (step === 3 && selectedClass && subjectName && topicName) {
        const topics = await prisma.curriculum.findMany({
          where: { className: selectedClass, subjectName: subjectName },
          distinct: ['topicName'],
          select: { topicName: true },
        });
        return res.json(topics);
      }
  
      // If step is not valid or required fields are missing
      res.status(400).json({ error: "Invalid step or missing required fields." });
    } catch (error) {
      console.error("Error processing quizStart request:", error.message);
      res.status(500).json({ error: "Failed to process request" });
    }
  
    
  }