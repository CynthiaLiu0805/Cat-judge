import { useState } from "react";
import "./App.css";

export default function App() {
  const [sideA_said, setSideA_said] = useState("");
  const [sideA_reason, setSideA_reason] = useState("");
  const [sideB_said, setSideB_said] = useState("");
  const [sideB_reason, setSideB_reason] = useState("");
  const [result, setResult] = useState("");

  async function handleJudge() {
    const body = {
      sideA_said,
      sideA_reason,
      sideB_said,
      sideB_reason,
    };

    const res = await fetch("http://localhost:5000/api/judge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setResult(data.reply);
  }

  return (
    <div className="container">
      <h1>🐱 猫咪法官 · 吵架仲裁系统</h1>

      <div className="columns">
        {/* LEFT SIDE */}
        <div className="side">
          <h2>😾 A 方</h2>
          <textarea
            placeholder="A说了什么？"
            value={sideA_said}
            onChange={(e) => setSideA_said(e.target.value)}
          />
          <textarea
            placeholder="A为什么生气？"
            value={sideA_reason}
            onChange={(e) => setSideA_reason(e.target.value)}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="side">
          <h2>😼 B 方</h2>
          <textarea
            placeholder="B说了什么？"
            value={sideB_said}
            onChange={(e) => setSideB_said(e.target.value)}
          />
          <textarea
            placeholder="B为什么生气？"
            value={sideB_reason}
            onChange={(e) => setSideB_reason(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleJudge}>⚖️ 开始裁决</button>

      {result && (
        <div className="result">
          <h2>🐾 判决结果</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
