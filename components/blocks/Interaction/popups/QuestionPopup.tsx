"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InteractionData } from "@/app/Store/editorStore";
import InteractionPopupShell from "./InteractionPopupShell";

interface QuestionPopupProps {
  data: InteractionData;
  onClose: () => void;
}

const QuestionPopup: React.FC<QuestionPopupProps> = ({ data, onClose }) => {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <InteractionPopupShell onClose={onClose} maxWidth={280}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 4px" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={26} color="#16a34a" />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", textAlign: "center", margin: 0 }}>
            Your response has been submitted
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setAnswer(""); }}
            style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 500, cursor: "pointer", marginTop: 2 }}
          >
            Answer again
          </button>
        </div>
      </InteractionPopupShell>
    );
  }

  return (
    <InteractionPopupShell onClose={onClose} maxWidth={280}>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
        {data.questionText || "What would you like to ask?"}
      </p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={data.questionPlaceholder || "Type your answer here…"}
        rows={4}
        style={{
          width: "100%",
          resize: "none",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          padding: 10,
          fontSize: 13,
          fontFamily: "inherit",
          color: "#111827",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        disabled={!answer.trim()}
        onClick={() => setSubmitted(true)}
        style={{
          width: "100%",
          marginTop: 12,
          padding: "10px 0",
          borderRadius: 8,
          border: "none",
          background: answer.trim() ? "#2563eb" : "#93c5fd",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: answer.trim() ? "pointer" : "not-allowed",
        }}
      >
        Submit
      </button>
    </InteractionPopupShell>
  );
};

export default QuestionPopup;
