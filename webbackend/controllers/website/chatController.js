import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Initialize the model with a system instruction for IntelliProp
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the IntelliProp AI Assistant. You help users with property valuations, real estate trends in Sri Lanka, and navigating the bidding system. Be professional, concise, and do not provide legal or financial advice."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response from Gemini" });
  }
};