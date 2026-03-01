import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // Using Mistral 7B Free - reliable and fast for chat
        model: "mistralai/mistral-7b-instruct:free", 
        messages: [
          { 
            role: "system", 
            content: `You are the IntelliProp Assistant. 
            Help users with:
            1. House price predictions.
            2. Land auctions (Remind users that bids must be higher than the current successful bid).
            3. Property filtering and ads.
            Keep responses professional and concise.` 
          },
          ...messages,
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", 
          "X-Title": "IntelliProp", 
        },
      }
    );

    // Safety check for OpenRouter response structure
    if (response.data && response.data.choices) {
      res.json(response.data.choices[0].message);
    } else {
      throw new Error("Invalid response from OpenRouter");
    }

  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

export default router;