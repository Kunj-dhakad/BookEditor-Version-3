"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InteractionData } from "@/app/Store/editorStore";
import InteractionPopupShell from "./InteractionPopupShell";

interface ContactFormPopupProps {
  data: InteractionData;
  onClose: () => void;
}

const ContactFormPopup: React.FC<ContactFormPopupProps> = ({ data, onClose }) => {
  const fields = data.contactFields?.length
    ? data.contactFields
    : [{ id: "name", label: "Full name", type: "text" as const, placeholder: "Full name", required: true }];

  const [values, setValues] = useState<Record<string, string>>({});
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const requiredMissing = fields.some((f) => f.required && !values[f.id]?.trim());
  const canSubmit = !requiredMissing && agreePrivacy;

  if (submitted) {
    return (
      <InteractionPopupShell onClose={onClose} maxWidth={300}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 4px" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={26} color="#16a34a" />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", textAlign: "center", margin: 0 }}>
            Thanks! Your form has been submitted
          </p>
        </div>
      </InteractionPopupShell>
    );
  }

  return (
    <InteractionPopupShell onClose={onClose} maxWidth={300}>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
        {data.contactFormTitle || "Tell us about this form"}
      </p>
      {data.contactFormDescription && (
        <p style={{ fontSize: 11.5, color: "#6b7280", margin: "0 0 12px", lineHeight: 1.4 }}>
          {data.contactFormDescription}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fields.map((field) => (
          <div key={field.id}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              {field.label}
              {field.required && <span style={{ color: "#dc2626" }}> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={values[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                rows={3}
                style={{ width: "100%", boxSizing: "border-box", borderRadius: 7, border: "1px solid #e5e7eb", padding: "8px 9px", fontSize: 12.5, fontFamily: "inherit", resize: "none" }}
              />
            ) : (
              <input
                type={field.type}
                value={values[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                style={{ width: "100%", boxSizing: "border-box", borderRadius: 7, border: "1px solid #e5e7eb", padding: "8px 9px", fontSize: 12.5, fontFamily: "inherit" }}
              />
            )}
          </div>
        ))}

        <label style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: "#374151", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          <span>
            {data.privacyPolicyText || "I agree to the following company's Privacy Policy:"}{" "}
            {data.privacyPolicyLink && (
              <a href={data.privacyPolicyLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                Privacy Policy
              </a>
            )}
          </span>
        </label>

        {data.showMarketingOptIn && (
          <label style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: "#374151", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={agreeMarketing}
              onChange={(e) => setAgreeMarketing(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>{data.marketingOptInText || "I agree to receive marketing materials"}</span>
          </label>
        )}
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => setSubmitted(true)}
        style={{
          width: "100%",
          marginTop: 14,
          padding: "10px 0",
          borderRadius: 8,
          border: "none",
          background: canSubmit ? "#2563eb" : "#93c5fd",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        Submit
      </button>
    </InteractionPopupShell>
  );
};

export default ContactFormPopup;
