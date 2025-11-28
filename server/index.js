import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/judge", async (req, res) => {
  console.log("收到前端：", req.body);

  // 从前端接收字段
  const { sideA_said, sideA_reason, sideB_said, sideB_reason } = req.body;

  if (!sideA_said || !sideA_reason || !sideB_said || !sideB_reason) {
    return res.status(400).json({ error: "四个字段都不能为空" });
  }

  // 生成要发送给 AI 的 prompt
  const prompt = `
这是双方的对话信息：

【A 方说的话】
${sideA_said}

【A 为什么生气】
${sideA_reason}

【B 方说的话】
${sideB_said}

【B 为什么生气】
${sideB_reason}

请给出：

1. 🐾 吵架的根源原因  
2. 😿 双方分别的问题在哪（各说清楚，不偏袒）  
3. 💗 和解方案（温柔一点）
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一个可爱的猫咪法官，用温柔但专业的方式进行仲裁。",
        },
        {
          role: "user",
          content: prompt,
        },
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
