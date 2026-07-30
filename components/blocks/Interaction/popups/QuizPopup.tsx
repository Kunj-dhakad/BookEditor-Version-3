"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InteractionData, QuizQuestionItem } from "@/app/Store/editorStore";
import InteractionPopupShell from "./InteractionPopupShell";

interface QuizPopupProps {
  data: InteractionData;
  onClose: () => void;
}

type AnswerMap = Record<string, string[]>; // questionId -> selected option ids

const QuizPopup: React.FC<QuizPopupProps> = ({ data, onClose }) => {
  const questions: QuizQuestionItem[] = useMemo(
    () => (data.quizQuestions?.length ? data.quizQuestions : []),
    [data.quizQuestions]
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [phase, setPhase] = useState<"quiz" | "submitted" | "results">("quiz");

  // All hooks must run unconditionally, in the same order, on every render —
  // so `current`/`selected`/`score` are computed here (with safe fallbacks
  // for an empty question list) BEFORE any early `return`.
  const current = questions.length
    ? questions[Math.min(step, questions.length - 1)]
    : undefined;
  const selected = current ? (answers[current.id] ?? []) : [];

  const score = useMemo(() => {
    let correctCount = 0;
    questions.forEach((q) => {
      const correctIds = q.options.filter((o) => o.correct).map((o) => o.id);
      const chosen = answers[q.id] ?? [];
      const isCorrect =
        correctIds.length === chosen.length &&
        correctIds.every((id) => chosen.includes(id));
      if (isCorrect) correctCount += 1;
    });
    return correctCount;
  }, [answers, questions]);

  const toggleOption = (optionId: string) => {
    if (!current) return;
    setAnswers((prev) => {
      const already = prev[current.id] ?? [];
      if (current.multiple) {
        const next = already.includes(optionId)
          ? already.filter((id) => id !== optionId)
          : [...already, optionId];
        return { ...prev, [current.id]: next };
      }
      return { ...prev, [current.id]: [optionId] };
    });
  };

  const goNext = () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("submitted");
    }
  };

  const retake = () => {
    setAnswers({});
    setStep(0);
    setPhase("quiz");
  };

  if (!questions.length) {
    return (
      <InteractionPopupShell onClose={onClose}>
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          Add questions to this quiz from the sidebar on the right.
        </p>
      </InteractionPopupShell>
    );
  }

  if (phase === "submitted") {
    return (
      <InteractionPopupShell onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 4px" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={26} color="#16a34a" />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", textAlign: "center", margin: 0 }}>
            Your response has been submitted
          </p>
          <button
            type="button"
            onClick={() => setPhase("results")}
            style={{ width: "100%", marginTop: 6, padding: "9px 0", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            View results
          </button>
          <button
            type="button"
            onClick={retake}
            style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 500, cursor: "pointer", marginTop: 2 }}
          >
            Retake quiz
          </button>
        </div>
      </InteractionPopupShell>
    );
  }

  if (phase === "results") {
    return (
      <InteractionPopupShell onClose={onClose}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
          {data.quizTitle || "Quiz results"}
        </p>
        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px" }}>
          You scored {score} out of {questions.length}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 260, overflowY: "auto" }}>
          {questions.map((q, i) => {
            const chosen = answers[q.id] ?? [];
            return (
              <div key={q.id}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>
                  {i + 1}. {q.question}
                </p>
                {q.options.map((opt) => {
                  const isChosen = chosen.includes(opt.id);
                  const style: React.CSSProperties = {
                    fontSize: 12,
                    padding: "5px 8px",
                    borderRadius: 6,
                    marginBottom: 3,
                    background: opt.correct ? "#ecfdf5" : isChosen ? "#fef2f2" : "#f9fafb",
                    color: opt.correct ? "#16a34a" : isChosen ? "#dc2626" : "#374151",
                    border: "1px solid",
                    borderColor: opt.correct ? "#a7f3d0" : isChosen ? "#fecaca" : "#e5e7eb",
                  };
                  return (
                    <div key={opt.id} style={style}>
                      {opt.text}
                      {opt.correct ? " ✓" : isChosen ? " ✗" : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={retake}
          style={{ width: "100%", marginTop: 12, padding: "9px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Retake quiz
        </button>
      </InteractionPopupShell>
    );
  }

  if (!current) return null;

  return (
    <InteractionPopupShell onClose={onClose}>
      <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px", fontWeight: 500 }}>
        Question {step + 1} of {questions.length}:
      </p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>
        {current.question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {current.options.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption(opt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textAlign: "left",
                padding: "9px 10px",
                borderRadius: 8,
                border: `1px solid ${isSelected ? "#2563eb" : "#e5e7eb"}`,
                background: isSelected ? "#eff6ff" : "#fff",
                cursor: "pointer",
                fontSize: 13,
                color: "#111827",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: current.multiple ? 4 : "50%",
                  border: `1.5px solid ${isSelected ? "#2563eb" : "#9ca3af"}`,
                  background: isSelected ? "#2563eb" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 10,
                }}
              >
                {isSelected ? "✓" : ""}
              </span>
              {String.fromCharCode(65 + i)}. {opt.text}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!selected.length}
        onClick={goNext}
        style={{
          width: "100%",
          marginTop: 14,
          padding: "10px 0",
          borderRadius: 8,
          border: "none",
          background: selected.length ? "#2563eb" : "#93c5fd",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: selected.length ? "pointer" : "not-allowed",
        }}
      >
        {step < questions.length - 1 ? "Next" : "Submit"}
      </button>
    </InteractionPopupShell>
  );
};

export default QuizPopup;
