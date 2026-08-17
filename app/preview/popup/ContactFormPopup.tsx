"use client";

import React, { useState } from "react";
import { submitInteractionResponse, type SubmitState } from "@/components/blocks/Interaction/popups/submitResponse";
import { CheckCircle2 } from "lucide-react";
import type { ContactField, InteractionBlock } from "../types/interaction";
import PopupShell from "./PopupShell";

interface Props {
  block: InteractionBlock;
  onClose: () => void;
}

const DEFAULT_FIELDS: ContactField[] = [
  {
    id: "name",
    label: "Full name",
    kind: "text",
    placeholder: "Full name",
    required: true,
  },
];

export default function ContactFormPopup({ block, onClose }: Props) {
  const fields = block.contactFields.length ? block.contactFields : DEFAULT_FIELDS;

  const [values, setValues] = useState<Record<string, string>>({});
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");

  const send = async () => {
    setState("sending");
    const answers: Record<string, unknown> = {};
    fields.forEach((field) => { answers[field.label || field.id] = values[field.id] ?? ""; });
    const result = await submitInteractionResponse(block.submitUrl, {
      kind: "contact-form",
      title: block.contactFormTitle,
      answers,
    });
    setState(result);
    if (result !== "failed") setSubmitted(true);
  };

  const missingRequired = fields.some(
    (field) => field.required && !values[field.id]?.trim(),
  );
  const canSubmit = !missingRequired && agreePrivacy;

  const setValue = (id: string, value: string) =>
    setValues((previous) => ({ ...previous, [id]: value }));

  if (submitted) {
    return (
      <PopupShell onClose={onClose} maxWidth={320} label="Contact form">
        <div className="flex flex-col items-center gap-2.5 px-1 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={26} className="text-emerald-600" />
          </div>
          <p className="m-0 text-center text-sm font-semibold">
            Thanks! Your form has been submitted
          </p>
        </div>
      </PopupShell>
    );
  }

  return (
    <PopupShell onClose={onClose} maxWidth={320} label="Contact form">
      <p className="m-0 mb-1.5 text-sm font-bold">
        {block.contactFormTitle || "Tell us about this form"}
      </p>
      {block.contactFormDescription && (
        <p className="m-0 mb-3 text-[11.5px] leading-relaxed text-slate-500">
          {block.contactFormDescription}
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="mb-1 block text-[11.5px] font-semibold text-slate-700">
              {field.label}
              {field.required && <span className="text-red-600"> *</span>}
            </label>
            {field.kind === "textarea" ? (
              <textarea
                value={values[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(event) => setValue(field.id, event.target.value)}
                rows={3}
                className="box-border w-full resize-none rounded-md border border-slate-200 px-2.5 py-2 font-sans text-[12.5px]"
              />
            ) : (
              <input
                type={field.kind}
                value={values[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(event) => setValue(field.id, event.target.value)}
                className="box-border w-full rounded-md border border-slate-200 px-2.5 py-2 font-sans text-[12.5px]"
              />
            )}
          </div>
        ))}

        <label className="flex cursor-pointer items-start gap-2 text-[11.5px] text-slate-700">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(event) => setAgreePrivacy(event.target.checked)}
            className="mt-0.5"
          />
          <span>
            {block.privacyPolicyText ||
              "I agree to the following company's Privacy Policy:"}{" "}
            {block.privacyPolicyLink && (
              <a
                href={block.privacyPolicyLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                Privacy Policy
              </a>
            )}
          </span>
        </label>

        {block.showMarketingOptIn && (
          <label className="flex cursor-pointer items-start gap-2 text-[11.5px] text-slate-700">
            <input
              type="checkbox"
              checked={agreeMarketing}
              onChange={(event) => setAgreeMarketing(event.target.checked)}
              className="mt-0.5"
            />
            <span>
              {block.marketingOptInText || "I agree to receive marketing materials"}
            </span>
          </label>
        )}
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={send}
        className="mt-3.5 w-full rounded-lg border-0 bg-blue-600 py-2.5 text-[13px] font-semibold text-white disabled:bg-blue-300"
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
