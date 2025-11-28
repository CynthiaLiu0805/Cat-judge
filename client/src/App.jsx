import { useState } from "react";
import jsPDF from "jspdf";
import "./App.css";
import "./fonts/NotoSansSC.js";
export default function App() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");

  const [sideA_said, setSideA_said] = useState("");
  const [sideA_reason, setSideA_reason] = useState("");
  const [sideB_said, setSideB_said] = useState("");
  const [sideB_reason, setSideB_reason] = useState("");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleJudge() {
    setLoading(true);
    setResult("");

    const body = {
      nameA,
      nameB,
      sideA_said,
      sideA_reason,
      sideB_said,
      sideB_reason,
    };

    const res = await fetch("http://localhost:5000/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setResult(data.reply);
    setLoading(false);
  }

  function downloadPDF() {
    const pdf = new jsPDF();

    pdf.addFileToVFS("NotoSansSC.ttf", window.NotoSansSC);  
pdf.addFont("NotoSansSC.ttf", "NotoSansSC", "normal");
pdf.setFont("NotoSansSC");

    pdf.setFontSize(20);
    pdf.text("🐱 猫咪法官判决书", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`👩‍⚖️ 审判双方：`, 20, 35);
    pdf.text(`A 方：${nameA}`, 20, 45);
    pdf.text(`B 方：${nameB}`, 20, 55);

    pdf.text(`📌 双方陈述：`, 20, 75);
    pdf.text(`【${nameA} 做了什么】`, 20, 85);
    pdf.text(sideA_said, 20, 95);

    pdf.text(`【${nameA} 为什么生气】`, 20, 115);
    pdf.text(sideA_reason, 20, 125);

    pdf.text(`【${nameB} 做了什么】`, 20, 145);
    pdf.text(sideB_said, 20, 155);

    pdf.text(`【${nameB} 为什么生气】`, 20, 175);
    pdf.text(sideB_reason, 20, 185);

    pdf.text(`🐾 猫咪法官判决：`, 20, 205);
    pdf.text(result, 20, 215, { maxWidth: 170 });

    pdf.save("猫咪法官判决书.pdf");
  }

  return (
    <div className="container">
      <h1>🐱 猫咪法官 · 吵架仲裁系统</h1>

      <div className="name-inputs">
        <input
          type="text"
          placeholder="A 方名字"
          value={nameA}
          onChange={(e) => setNameA(e.target.value)}
        />
        <input
          type="text"
          placeholder="B 方名字"
          value={nameB}
          onChange={(e) => setNameB(e.target.value)}
        />
      </div>

      <div className="columns">
        <div className="side">
          <h2>😾 {nameA || "A 方"}</h2>
          <textarea
            placeholder={`${nameA || "A"} 做了什么？`}
            value={sideA_said}
            onChange={(e) => setSideA_said(e.target.value)}
          />
          <textarea
            placeholder={`${nameA || "A"} 为什么生气？`}
            value={sideA_reason}
            onChange={(e) => setSideA_reason(e.target.value)}
          />
        </div>

        <div className="side">
          <h2>😼 {nameB || "B 方"}</h2>
          <textarea
            placeholder={`${nameB || "B"} 做了什么？`}
            value={sideB_said}
            onChange={(e) => setSideB_said(e.target.value)}
          />
          <textarea
            placeholder={`${nameB || "B"} 为什么生气？`}
            value={sideB_reason}
            onChange={(e) => setSideB_reason(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleJudge} disabled={loading}>
        {loading ? "🐱 猫咪正在认真审判中…" : "⚖️ 开始裁决"}
      </button>

      {loading && <div className="dots">● ● ●</div>}

      {result && (
        <div className="result">
          <h2>🐾 判决结果</h2>
          <pre>{result}</pre>

          <button className="pdf-btn" onClick={downloadPDF}>
            📄 下载 PDF 判决书
          </button>
        </div>
      )}
    </div>
  );
}
