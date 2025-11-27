import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToJudge = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResult(data.reply);
    } catch (err) {
      setResult("服务器错误，请检查后端是否启动！");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        width: "600px",
        margin: "40px auto",
        textAlign: "center",
      }}
    >
      <h1>🐱 猫猫法官</h1>

      <textarea
        rows="4"
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        placeholder="请输入案件描述..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={sendToJudge}
        disabled={loading}
      >
        {loading ? "判词中..." : "提交给猫法官"}
      </button>

      <div
        style={{
          marginTop: "20px",
          whiteSpace: "pre-wrap",
          textAlign: "left",
          background: "#f0f0f0",
          padding: "15px",
          borderRadius: "8px",
          minHeight: "100px",
        }}
      >
        {result || "（判词会出现在这里）"}
      </div>
    </div>
  );
}
