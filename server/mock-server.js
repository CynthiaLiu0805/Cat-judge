// mock-server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 可选：一些随机句子池，让返回更不单调
const summaries = [
  "争吵围绕沟通期待不同。",
  "争执源于对时间的误解。",
  "争吵因为消息回复延迟。"
];

const suggestionsA = [
  "尝试明确说明你希望的时间段，例如：今晚八点能不能回我。",
  "用'I'句式表达感受，例如：我会难过如果你没回我。",
  "先说明事实，再表达感受：我看到你没回，我会担心。"
];

const suggestionsB = [
  "解释原因并给出可行时间：我通常工作到六点，晚点回你。",
  "给出替代方案：我会在中午回你，或者发一条说明。",
  "表示理解并提供安抚：抱歉让你担心，我改进沟通。"
];

const comforts = [
  "猫猫拍拍你们，先深呼吸三下～",
  "别急，先喝口水，回头再聊喵～",
  "猫猫抱抱，先冷静一分钟再继续。"
];

const verdicts = ["和解建议", "冷静一下", "面对面沟通"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.post("/api/judge", (req, res) => {
  const { text } = req.body || {};

  // 简单日志（不保存）
  console.log("收到内容：", text ? text.slice(0, 200) : "(空)");

  const response = {
    summary: pick(summaries),
    suggestionA: pick(suggestionsA),
    suggestionB: pick(suggestionsB),
    comfort: pick(comforts),
    verdict: pick(verdicts)
  };

  // 模拟思考延迟（可选），让体验更像真实AI
  setTimeout(() => {
    res.json({ result: response });
  }, 600); // 600ms 延迟
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🐱 Mock 猫猫法官 API 运行中 → http://localhost:${PORT}/api/judge`);
});
