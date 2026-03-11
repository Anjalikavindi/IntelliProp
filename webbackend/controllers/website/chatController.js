import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = "You are the IntelliProp AI Assistant. You help users with property valuations and real estate in Sri Lanka. Be professional and concise.";
    const finalPrompt = `${systemInstruction}\n\nUser: ${prompt}`;

    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini Error Details:", error);

    // Automatic Fallback to the most basic stable model if 2.5 is not found
    if (error.status === 404) {
      console.log("Model 2.5 not found, falling back to basic gemini-pro...");
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await fallbackModel.generateContent(prompt);
        return res.status(200).json({ reply: result.response.text() });
      } catch (fallbackError) {
        return res.status(500).json({ error: "AI service currently unavailable in this region." });
      }
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};