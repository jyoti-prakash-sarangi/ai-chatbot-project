const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Groq setup (IMPORTANT CHANGE HERE)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",  // FREE model
      messages: [
        { role: "user", content: userMessage }
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Error:", error);
    res.json({
      reply: "Error getting response from AI 😢",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});