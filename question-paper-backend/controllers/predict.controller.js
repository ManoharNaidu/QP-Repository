import { GoogleGenerativeAI } from "@google/generative-ai";
import QuestionPaper from "../models/QuestionPaper.js";

/**
 * Predicts likely exam questions by analyzing historical extracted paper text using Gemini.
 * @param {import("express").Request} req Incoming request with `courseCode` path param.
 * @param {import("express").Response} res Express response.
 * @param {import("express").NextFunction} next Express error-forwarding callback.
 * @returns {Promise<void>} Resolves when a response is sent.
 */
export const predictQuestions = async (req, res, next) => {
  try {
    const { courseCode } = req.params;

    if (!courseCode) {
      return res.status(400).json({ message: "Course code is required" });
    }

    // 1. Fetch all papers for this course code
    const papers = await QuestionPaper.find({
      courseCode: courseCode.toUpperCase(),
    }).select("extractedText year semester academicYear");

    if (!papers || papers.length === 0) {
      return res.status(404).json({
        message:
          "No historical data found for this course code to make a prediction.",
      });
    }

    // 2. Combine extracted text for analysis
    const combinedText = papers
      .filter((p) => p.extractedText)
      .map((p) => `Paper (${p.academicYear} ${p.year}):\n${p.extractedText}`)
      .join("\n\n---\n\n");

    if (!combinedText) {
      return res.status(400).json({
        message:
          "No text content available in existing papers for this course.",
      });
    }

    // 3. AI Analysis using Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert academic analyst. I am providing you with the extracted text from multiple previous years' question papers for a specific course (Course Code: ${courseCode}).
      
      Your task:
      1. Analyze the frequency and importance of topics mentioned in these papers.
      2. Identify recurring questions or question patterns.
      3. Predict the most likely questions or topics for the upcoming exam.
      
      Format the response in JSON with the following structure:
      {
        "courseCode": "${courseCode}",
        "analysisSummary": "A brief summary of what you found from the papers.",
        "frequentTopics": [
           { "topic": "Name", "importance": "High/Medium/Low", "reason": "Why?" }
        ],
        "predictedQuestions": [
           { "question": "The question text", "probability": "High/Medium/Low", "context": "Basis for prediction" }
        ],
        "tips": ["General study tips for this course based on paper patterns"]
      }
      
      Only provide the JSON object.
      
      EXTRACTED TEXT DATA:
      ${combinedText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response from Gemini
    try {
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const predictionData = JSON.parse(jsonStr);
      res.status(200).json(predictionData);
    } catch (parseErr) {
      console.error("AI Response Parsing Failed:", parseErr, text);
      res.status(500).json({
        message: "AI analysis completed but returned invalid format.",
        rawOutput: text,
      });
    }
  } catch (error) {
    next(error);
  }
};
