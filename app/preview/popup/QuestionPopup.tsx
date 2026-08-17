"use client";

import React, { useState } from "react";
import { submitInteractionResponse, type SubmitState } from "@/components/blocks/Interaction/popups/submitResponse";
import { CheckCircle2 } from "lucide-react";
import type { InteractionBlock } from "../types/interaction";
import PopupShell from "./PopupShell";

interface Props {
  block: InteractionBlock;
  onClose: () => void;
}

export default function QuestionPopup({ block, onClose }: Props) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");

  const send = async () => {
    setState("sending");
    const result = await submitInteractionResponse(block.submitUrl, {
      kind: "question",
      title: block.questionTitle,
      answers: { [block.questionText || "question"]: answer },
    });
    setState(result);
    if (result !== "failed") setSubmitted(true);
  };

  if (submitted) {
    return (
      <PopupShell onClose={onClose} maxWidth={300} label="Question">
        <div className="flex flex-col items-center gap-2.5 px-1 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={26} className="text-emerald-600" />
          </div>
          <p className="m-0 text-center text-sm font-semibold">
            Your response has been submitted
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setAnswer("");
            }}
            className="border-0 bg-transparent text-xs font-medium text-blue-600"
          >
            Answer again
          </button>
        </div>
      </PopupShell>
    );
  }

  return (
    <PopupShell onClose={onClose} maxWidth={300} label="Question">
      <p className="m-0 mb-2.5 text-sm font-bold">
        {block.questionText || block.questionTitle || "What would you like to ask?"}
      </p>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={block.questionPlaceholder || "Type your answer here…"}
        rows={4}
        className="box-border w-full resize-none rounded-lg border border-slate-200 p-2.5 font-sans text-[13px] text-slate-900"
      />
      <button
        type="button"
        disabled={!answer.trim()}
        onClick={send}
        className="mt-3 w-full rounded-lg border-0 bg-blue-600 py-2.5 text-[13px] font-semibold text-white disabled:bg-blue-300"
      >
        {state === "sending" ? "Sending…" : "Submit"}
      </button>
      {state === "failed" && (
        <p style={{ marginTop: 8, fontSize: 11.5, color: "#dc2626" }}>
          Could not send your response. Please try again.
        </p>
      )}
    </PopupShell>
  );
}
