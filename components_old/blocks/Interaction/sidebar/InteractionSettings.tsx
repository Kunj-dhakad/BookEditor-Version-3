"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Plus, Trash2 } from "lucide-react";
import useEditorStore, {
  ContactFormField,
  InteractionData,
  QuizOption,
  QuizQuestionItem,
  isInteractionData,
} from "@/app/Store/editorStore";

const genId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export default function InteractionSettings() {
  const slides = useEditorStore((s) => s.slides);
  const activeSlide = useEditorStore((s) => s.activeSlide);
  const activeElementId = useEditorStore((s) => s.activeElementId);
  const updateElement = useEditorStore((s) => s.updateElement);
  const element = slides[activeSlide]?.elements.find(
    (item) => item.id === activeElementId,
  );

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!element || !isInteractionData(element.data)) return null;
  const data = element.data as InteractionData;
  const patch = (value: Partial<InteractionData>) =>
    updateElement(element.id, value, { history: true });

  const isQuiz = data.interactionKind === "quiz";
  const isQuestion = data.interactionKind === "question";
  const isContactForm = data.interactionKind === "contact-form";
  const isEngagement = isQuiz || isQuestion || isContactForm;

  /* ==================== QUIZ HELPERS ==================== */

  const setQuestions = (questions: QuizQuestionItem[]) =>
    patch({ quizQuestions: questions });

  const addQuestion = () => {
    const questions = data.quizQuestions ?? [];
    setQuestions([
      ...questions,
      {
        id: genId(),
        question: "New question",
        multiple: false,
        options: [
          { id: genId(), text: "Option A", correct: true },
          { id: genId(), text: "Option B", correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (qId: string) =>
    setQuestions((data.quizQuestions ?? []).filter((q) => q.id !== qId));

  const updateQuestion = (qId: string, patchQ: Partial<QuizQuestionItem>) =>
    setQuestions(
      (data.quizQuestions ?? []).map((q) =>
        q.id === qId ? { ...q, ...patchQ } : q,
      ),
    );

  const addOption = (qId: string) =>
    updateQuestion(qId, {
      options: [
        ...(data.quizQuestions?.find((q) => q.id === qId)?.options ?? []),
        { id: genId(), text: "New option", correct: false },
      ],
    });

  const removeOption = (qId: string, optId: string) => {
    const q = data.quizQuestions?.find((item) => item.id === qId);
    if (!q) return;
    updateQuestion(qId, { options: q.options.filter((o) => o.id !== optId) });
  };

  const updateOption = (qId: string, optId: string, patchO: Partial<QuizOption>) => {
    const q = data.quizQuestions?.find((item) => item.id === qId);
    if (!q) return;
    updateQuestion(qId, {
      options: q.options.map((o) => {
        if (o.id !== optId) {
          // enforce single-correct when not multiple choice
          return patchO.correct && !q.multiple ? { ...o, correct: false } : o;
        }
        return { ...o, ...patchO };
      }),
    });
  };

  /* ==================== CONTACT FORM HELPERS ==================== */

  const setFields = (fields: ContactFormField[]) => patch({ contactFields: fields });

  const addField = () =>
    setFields([
      ...(data.contactFields ?? []),
      { id: genId(), label: "New field", type: "text", placeholder: "New field", required: false },
    ]);

  const removeField = (fId: string) =>
    setFields((data.contactFields ?? []).filter((f) => f.id !== fId));

  const updateField = (fId: string, patchF: Partial<ContactFormField>) =>
    setFields((data.contactFields ?? []).map((f) => (f.id === fId ? { ...f, ...patchF } : f)));

  /* ==================== AI GENERATE ==================== */

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    setAiError(null);
    try {
      if (isQuiz) {
        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: aiPrompt, mode: "quiz", count: data.quizQuestions?.length || 3 }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Generation failed");
        const questions: QuizQuestionItem[] = json.questions.map((q: { question: string; options: { text: string; correct: boolean }[] }) => ({
          id: genId(),
          question: q.question,
          multiple: false,
          options: q.options.map((o) => ({ id: genId(), text: o.text, correct: !!o.correct })),
        }));
        patch({ quizTitle: json.title, quizQuestions: questions });
      } else if (isQuestion) {
        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: aiPrompt, mode: "question" }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Generation failed");
        patch({ questionText: json.question, questionPlaceholder: json.placeholder });
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Failed to generate");
    } finally {
      setAiLoading(false);
    }
  };

  /* ==================== RENDER ==================== */

  return (
    <div className="kd-btn-setting-panel w-full h-full p-3 overflow-y-auto">
      <p className="kd-btn-setting-section-title">
        {isQuiz ? "Quiz" : isQuestion ? "Question" : isContactForm ? "Contact form" : "Interaction"}
      </p>

      <label className="kd-btn-setting-label block mb-1">Button label</label>
      <input
        className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
        value={data.text}
        placeholder="e.g. TAKE QUIZ"
        onChange={(event) => patch({ text: event.target.value })}
      />

      {/* ===================== AI GENERATE (quiz / question) ===================== */}
      {(isQuiz || isQuestion) && (
        <div className="mb-4 rounded-lg border border-gray-200 p-2.5">
          <label className="kd-btn-setting-label block mb-1">
            Write it yourself, or generate with AI
          </label>
          <textarea
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-2"
            rows={2}
            placeholder={isQuiz ? "e.g. KPIs for a business team" : "e.g. Ask about our overtime policy"}
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
          />
          <button
            type="button"
            disabled={!aiPrompt.trim() || aiLoading}
            onClick={handleGenerateWithAi}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-[12.5px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {aiLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles size={14} /> Generate with AI
              </>
            )}
          </button>
          {aiError && <p className="text-[11px] text-red-500 mt-1">{aiError}</p>}
        </div>
      )}

      {/* ===================== QUIZ QUESTIONS ===================== */}
      {isQuiz && (
        <div className="mb-3">
          <label className="kd-btn-setting-label block mb-1">Quiz title</label>
          <input
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            value={data.quizTitle ?? ""}
            onChange={(event) => patch({ quizTitle: event.target.value })}
          />

          {(data.quizQuestions ?? []).map((q, qIndex) => (
            <div key={q.id} className="rounded-lg border border-gray-200 p-2.5 mb-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-gray-500">Question {qIndex + 1}</span>
                <button type="button" onClick={() => removeQuestion(q.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <Trash2 size={13} />
                </button>
              </div>
              <input
                className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-2"
                value={q.question}
                onChange={(event) => updateQuestion(q.id, { question: event.target.value })}
              />

              <label className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!q.multiple}
                  onChange={(event) => updateQuestion(q.id, { multiple: event.target.checked })}
                />
                Allow multiple correct answers
              </label>

              {q.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-1.5 mb-1.5">
                  <input
                    type={q.multiple ? "checkbox" : "radio"}
                    name={`correct-${q.id}`}
                    checked={!!opt.correct}
                    onChange={(event) => updateOption(q.id, opt.id, { correct: event.target.checked })}
                  />
                  <input
                    className="kd-btn-setting-input flex-1 px-2 py-1"
                    value={opt.text}
                    onChange={(event) => updateOption(q.id, opt.id, { text: event.target.value })}
                  />
                  <button type="button" onClick={() => removeOption(q.id, opt.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(q.id)}
                className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium mt-1 cursor-pointer"
              >
                <Plus size={12} /> Add option
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-[12.5px] font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
          >
            <Plus size={14} /> Add question
          </button>
        </div>
      )}

      {/* ===================== SINGLE QUESTION ===================== */}
      {isQuestion && (
        <div className="mb-3">
          <label className="kd-btn-setting-label block mb-1">Question text</label>
          <textarea
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            rows={2}
            value={data.questionText ?? ""}
            onChange={(event) => patch({ questionText: event.target.value })}
          />
          <label className="kd-btn-setting-label block mb-1">Answer placeholder</label>
          <input
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            value={data.questionPlaceholder ?? ""}
            onChange={(event) => patch({ questionPlaceholder: event.target.value })}
          />
        </div>
      )}

      {/* ===================== CONTACT FORM ===================== */}
      {isContactForm && (
        <div className="mb-3">
          <label className="kd-btn-setting-label block mb-1">Form title</label>
          <input
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            value={data.contactFormTitle ?? ""}
            onChange={(event) => patch({ contactFormTitle: event.target.value })}
          />
          <label className="kd-btn-setting-label block mb-1">Description</label>
          <textarea
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            rows={3}
            value={data.contactFormDescription ?? ""}
            onChange={(event) => patch({ contactFormDescription: event.target.value })}
          />

          <label className="kd-btn-setting-label block mb-1.5">Fields</label>
          {(data.contactFields ?? []).map((field) => (
            <div key={field.id} className="rounded-lg border border-gray-200 p-2 mb-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <input
                  className="kd-btn-setting-input flex-1 px-2 py-1"
                  value={field.label}
                  onChange={(event) => updateField(field.id, { label: event.target.value, placeholder: event.target.value })}
                />
                <button type="button" onClick={() => removeField(field.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="kd-btn-setting-input px-2 py-1"
                  value={field.type}
                  onChange={(event) => updateField(field.id, { type: event.target.value as ContactFormField["type"] })}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="textarea">Textarea</option>
                </select>
                <label className="flex items-center gap-1 text-[11px] text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!field.required}
                    onChange={(event) => updateField(field.id, { required: event.target.checked })}
                  />
                  Required
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addField}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-[12.5px] font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 cursor-pointer mb-3"
          >
            <Plus size={14} /> Add field
          </button>

          <label className="kd-btn-setting-label block mb-1">Privacy policy text</label>
          <input
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-2"
            value={data.privacyPolicyText ?? ""}
            onChange={(event) => patch({ privacyPolicyText: event.target.value })}
          />
          <label className="kd-btn-setting-label block mb-1">Privacy policy link</label>
          <input
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            value={data.privacyPolicyLink ?? ""}
            placeholder="https://example.com/privacy"
            onChange={(event) => patch({ privacyPolicyLink: event.target.value })}
          />

          <label className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!data.showMarketingOptIn}
              onChange={(event) => patch({ showMarketingOptIn: event.target.checked })}
            />
            Show marketing opt-in checkbox
          </label>
          {data.showMarketingOptIn && (
            <input
              className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
              value={data.marketingOptInText ?? ""}
              onChange={(event) => patch({ marketingOptInText: event.target.value })}
            />
          )}
        </div>
      )}

      {/* ===================== NON-ENGAGEMENT (link / tag / social / caption) ===================== */}
      {!isEngagement && (
        <>
          <label className="kd-btn-setting-label block mb-1">URL</label>
          <input
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            value={data.url ?? data.link ?? ""}
            placeholder="https://example.com"
            onChange={(event) =>
              patch({ url: event.target.value, link: event.target.value })
            }
          />
          <label className="kd-btn-setting-label block mb-1">Link type</label>
          <select
            className="kd-btn-setting-input w-full px-2.5 py-1.5 mb-3"
            value={data.target ?? "_blank"}
            onChange={(event) =>
              patch({ target: event.target.value as InteractionData["target"] })
            }
          >
            <option value="_self">Current tab</option>
            <option value="_blank">New tab</option>
            <option value="popup">Popup</option>
          </select>
        </>
      )}

      <label className="kd-btn-setting-label block mb-1">
        {isEngagement ? "Text color" : "Icon color"}
      </label>
      <input
        type="color"
        className="w-full h-9 mb-3 cursor-pointer"
        value={data.iconColor ?? data.textColor ?? "#ffffff"}
        onChange={(event) =>
          patch({
            iconColor: event.target.value,
            textColor: event.target.value,
          })
        }
      />
      <label className="kd-btn-setting-label block mb-1">
        Background color
      </label>
      <input
        type="color"
        className="w-full h-9 cursor-pointer"
        value={data.backgroundColor ?? "#4f46e5"}
        onChange={(event) => patch({ backgroundColor: event.target.value })}
      />
    </div>
  );
}
