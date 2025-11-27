import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!text.trim()) return alert("请输入争吵内容或要点");
    setLoading(true);
    setResp(null);

    try {
      const r = await fetch("http://localhost:3001/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await r.json();
      setResp(data.result);
    } catch (e) {
      alert("请求失败，请检查后端是否已启动");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>🐱 猫猫法官 · 吵架评理（本地 Mock 版）</h1>
      <textarea
        rows="6"
        style={{ width: "100%", fontSize: 16 }}
        placeholder="写下你们争吵的要点（简短即可）"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={submit} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "猫猫判决中..." : "提交给猫猫法官"}
        </button>
      </div>

      {resp && (
        <div style={{ marginTop: 20, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <h3>判词</h3>
          <p><strong>摘要：</strong>{resp.summary}</p>
          <p><strong>建议（甲）：</strong>{resp.suggestionA}</p>
          <p><strong>建议（乙）：</strong>{resp.suggestionB}</p>
          <p><strong>安抚：</strong>{resp.comfort}</p>
          <p><strong>结论：</strong>{resp.verdict}</p>
        </div>
      )}
    </div>
  );
}
