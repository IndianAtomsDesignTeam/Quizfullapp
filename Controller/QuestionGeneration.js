// quizGenerator.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeminiKey = process.env.GEMINI_KEY;
require("dotenv").config();

async function generateQuizForTopic(topic) {
  const genAI = new GoogleGenerativeAI(GeminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `
Generate 20 multiple-choice questions on "${topic}".
Each question must be provided as a JSON object with the exact following fields:

{
  "serialNumber": "<A unique number starting from 1>",
  "question": "<The question text>",
  "optionA": "<Option A text>",
  "optionB": "<Option B text>",
  "optionC": "<Option C text>",
  "optionD": "<Option D text>",
  "correctAnswer": "<One of: A, B, C, or D>",
  "explanation": "<A brief explanation of why the correct answer is correct>",
  "toughness": "<Difficulty level: Easy, Medium, or Hard>",
  "subTopic": "<The specific sub-topic within ${topic}>",
  "chapterName": "<The chapter name this question belongs to>"
}

Please ensure that:
- All questions strictly pertain to the topic "${topic}".
- Each option (A, B, C, D) is distinct and plausible.
- The "correctAnswer" field must contain exactly one letter (A, B, C, or D) corresponding to the correct option.
- The "serialNumber" should start at 1 and increment by 1 for each question.
- The "explanation" should be concise and clear.
- The output must be a valid JSON array containing exactly 20 question objects.
- Do not include any additional text or commentary outside the JSON structure.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/^```json\n/, "")
      .replace(/^```\n?$/, "")
      .replace(/```$/, "")
      .trim();

    const quizData = JSON.parse(cleaned);

    console.log(`📘 Quiz generated for topic: ${topic}`);
    console.log(JSON.stringify(quizData, null, 2));
  } catch (error) {
    console.error("❌ Error generating quiz:", error.message);
  }
}

module.exports = generateQuizForTopic;
