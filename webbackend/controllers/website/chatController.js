import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = `
      You are the IntelliProp AI Assistant, an expert on the IntelliProp real estate platform in Sri Lanka. 
      Your goal is to guide users on using the platform's specific features:

      1. HOW TO PLACE BIDS ON LAND:
         - Users must find a land ad with "Bidding Allowed".
         - They can see the remaining time and the current highest bid.
         - To bid, they enter an amount higher than the current bid. 
         - Bids are validated; if successful, they become the highest bidder.
         - At the end of the auction, the highest bidder is notified via email.

      2. HOW TO POST ADS:
         - Users must create a profile and verify their email.
         - Go to the "Post Ad" section and choose between "House" or "Land".
         - Fill in details (title, district, area, price/details).
         - For House ads, they can use the "Price Prediction" tool.
         - For Land ads, they can customize the auction end date if they enable bidding.
         - Ads are sent to Administration for review before being published.

      3. HOW TO GET PREDICTED HOUSE PRICES:
         - This feature is available when advertising a House.
         - Users provide details like location, sqft, bedrooms, and bathrooms.
         - The AI/Model exploring predicted prices helps sellers set a competitive market value.

      Tone: Professional, helpful, and concise. Always refer to "IntelliProp" features.
    `;
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