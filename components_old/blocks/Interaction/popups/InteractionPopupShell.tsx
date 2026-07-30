"use client";

import React from "react";
import { X } from "lucide-react";

interface InteractionPopupShellProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

const InteractionPopupShell: React.FC<InteractionPopupShellProps> = ({
  onClose,
  children,
  maxWidth = 300,
}) => {
  return (
    <div
      data-element="true"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15, 15, 20, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        borderRadius: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `min(${maxWidth}px, 92%)`,
          maxHeight: "88%",
          background: "#ffffff",
          borderRadius: 14,
          boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <X size={14} />
        </button>
        <div
          style={{
            padding: "18px 16px 16px",
            overflowY: "auto",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default InteractionPopupShell;
