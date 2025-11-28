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
  const { nameA, nameB, sideA_said, sideA_reason, sideB_said, sideB_reason } = req.body;

  console.log("收到前端：", req.body);

  if (!sideA_said && !sideB_said) {
    return res.status(400).json({ error: "内容不能为空" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一个可爱的猫咪法官，用温柔但专业的方式仲裁双方争吵。",
        },
        {
          role: "user",
          content: `
双方信息如下：

【${nameA || "A 方"} 说的话】
${sideA_said}

【${nameA || "A 方"} 为什么生气】
${sideA_reason}

【${nameB || "B 方"} 说的话】
${sideB_said}

【${nameB || "B 方"} 为什么生气】
${sideB_reason}

请给出：
1. 吵架的根本原因
2. 双方各自的问题（公平，不偏袒）
3. 温柔的和解方案
        `,
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
