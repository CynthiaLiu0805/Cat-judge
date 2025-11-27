import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/judge", async (req, res) => {
  const { prompt } = req.body;
  const cleanPrompt = typeof prompt === "string" ? prompt.trim() : "";

  if (!cleanPrompt) {
    return res.status(400).json({ error: "prompt 不能为空" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "你是可爱的猫咪法官，喜欢给猫咪判词。" },
        { role: "user", content: cleanPrompt },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI 服务器错误" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
