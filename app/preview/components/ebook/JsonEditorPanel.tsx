"use client";

import React, { useState } from 'react';
import { useBook } from './BookStateContext';
import { FileCode, AlertTriangle, Check, X } from 'lucide-react';

interface Preset {
  name: string;
  desc: string;
  data: any;
}

const PRESETS: Record<string, Preset> = {
  portrait: {
    name: "Portrait Book (350 x 434)",
    desc: "Interactive vertical-oriented pages",
    data: {
      width: 350,
      height: 434,
      slides: [
        {
          id: "p1",
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          elements: [
            { id: "t1", data: { type: "text", x: 20, y: 50, width: 310, text: "FABLE OF LIGHT", fontSize: 24, fontWeight: "bold", textColor: "#ffffff", textAlign: "center" } },
            { id: "t2", data: { type: "text", x: 20, y: 90, width: 310, text: "A Tale of Two Pyres", fontSize: 13, textColor: "#a5b4fc", textAlign: "center" } },
            { id: "img1", data: { type: "image", x: 30, y: 130, width: 290, height: 180, src: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80", borderRadius: 12 } },
            { id: "t3", data: { type: "text", x: 20, y: 340, width: 310, text: "Chapter I: The sparks in the frozen forests of the Far Ridge...", fontSize: 12, textColor: "#c7d2fe", textAlign: "center", lineHeight: 1.5 } }
          ]
        },
        {
          id: "p2",
          background: "#fafaf9",
          elements: [
            { id: "t4", data: { type: "text", x: 30, y: 40, width: 290, text: "The Whispering Pines", fontSize: 18, fontWeight: "bold", textColor: "#1c1917" } },
            { id: "img2", data: { type: "image", x: 30, y: 80, width: 290, height: 160, src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80", borderRadius: 8 } },
            { id: "t5", data: { type: "text", x: 30, y: 260, width: 290, text: "They found the crystals hidden between deep roots. Not a single soul dared to pick them up, knowing the lore of the elder wood guardians.", fontSize: 12, textColor: "#44403c", lineHeight: 1.5 } },
            { id: "t6", data: { type: "text", x: 30, y: 380, width: 290, text: "Page 2", fontSize: 11, textColor: "#a8a29e", textAlign: "center" } }
          ]
        },
        {
          id: "p3",
          background: "#fafaf9",
          elements: [
            { id: "t7", data: { type: "text", x: 30, y: 40, width: 290, text: "A Secret Revealed", fontSize: 18, fontWeight: "bold", textColor: "#1c1917" } },
            { id: "img3", data: { type: "image", x: 30, y: 80, width: 290, height: 160, src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80", borderRadius: 8 } },
            { id: "t8", data: { type: "text", x: 30, y: 260, width: 290, text: "As dusk approached, the pine hollow lit up with fluorescent flora, casting soft shadows on their path toward the mountain gate.", fontSize: 12, textColor: "#44403c", lineHeight: 1.5 } },
            { id: "t9", data: { type: "text", x: 30, y: 380, width: 290, text: "Page 3", fontSize: 11, textColor: "#a8a29e", textAlign: "center" } }
          ]
        },
        {
          id: "p4",
          background: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
          elements: [
            { id: "t10", data: { type: "text", x: 20, y: 80, width: 310, text: "TO BE CONTINUED", fontSize: 20, fontWeight: "bold", textColor: "#f472b6", textAlign: "center" } },
            { id: "img4", data: { type: "image", x: 50, y: 130, width: 250, height: 180, src: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80", borderRadius: 12 } },
            { id: "t11", data: { type: "text", x: 20, y: 340, width: 310, text: "Get ready for Volume II.", fontSize: 12, textColor: "#f472b6", textAlign: "center" } }
          ]
        }
      ]
    }
  },
  landscape: {
    name: "Landscape Book (690 x 434)",
    desc: "Perfect wide orientation",
    data: {
      width: 690,
      height: 434,
      pages: [
        {
          id: "p1",
          background: "linear-gradient(to right, #065f46, #064e3b)",
          elements: [
            { id: "t1", data: { type: "text", x: 50, y: 100, width: 590, text: "NATURE SPEAKS IN SILENCE", fontSize: 32, fontWeight: "bold", textColor: "#ffffff", textAlign: "center" } },
            { id: "t2", data: { type: "text", x: 50, y: 160, width: 590, text: "A Forest Photography Ebook", fontSize: 16, textColor: "#34d399", textAlign: "center" } },
            { id: "t3", data: { type: "text", x: 50, y: 340, width: 590, text: "WILDERNESS EXHIBIT", fontSize: 11, fontWeight: "bold", textColor: "#a7f3d0", textAlign: "center" } }
          ]
        },
        {
          id: "p2",
          background: "#022c22",
          elements: [
            { id: "img1", data: { type: "image", x: 40, y: 50, width: 310, height: 334, src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=80", borderRadius: 16 } },
            { id: "t4", data: { type: "text", x: 380, y: 80, width: 270, text: "Deep Canopy Reserves", fontSize: 20, fontWeight: "bold", textColor: "#f0fdf4" } },
            { id: "t5", data: { type: "text", x: 380, y: 130, width: 270, text: "Old growth redwood columns reach hundreds of feet into the California skies. This dynamic temperate rainforest holds ecosystems found nowhere else on earth, thriving on pacific vapor.", fontSize: 13, textColor: "#a7f3d0", lineHeight: 1.6 } }
          ]
        },
        {
          id: "p3",
          background: "#022c22",
          elements: [
            { id: "img2", data: { type: "image", x: 340, y: 50, width: 310, height: 334, src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=500&q=80", borderRadius: 16 } },
            { id: "t6", data: { type: "text", x: 40, y: 80, width: 270, text: "The Misty Hollows", fontSize: 20, fontWeight: "bold", textColor: "#f0fdf4" } },
            { id: "t7", data: { type: "text", x: 40, y: 130, width: 270, text: "Fog acts like a vital irrigation layer, dripping moisture off massive leaves down onto the thick, damp forest floor carpeted with rich moss and ferns.", fontSize: 13, textColor: "#a7f3d0", lineHeight: 1.6 } }
          ]
        },
        {
          id: "p4",
          background: "linear-gradient(to left, #065f46, #064e3b)",
          elements: [
            { id: "t8", data: { type: "text", x: 50, y: 160, width: 590, text: "THE GREEN EXHIBIT - THE END", fontSize: 24, fontWeight: "bold", textColor: "#ffffff", textAlign: "center" } }
          ]
        }
      ]
    }
  },
  square: {
    name: "Square Book (434 x 434)",
    desc: "1:1 modern ratio",
    data: {
      width: 434,
      height: 434,
      items: [
        {
          id: "p1",
          background: "#ea580c",
          elements: [
            { id: "t1", data: { type: "text", x: 30, y: 60, width: 374, text: "CREATIVE SQUARES", fontSize: 26, fontWeight: "900", textColor: "#ffffff", textAlign: "center" } },
            { id: "img1", data: { type: "image", x: 67, y: 120, width: 300, height: 200, src: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80", borderRadius: 16 } },
            { id: "t2", data: { type: "text", x: 30, y: 345, width: 374, text: "A Balanced One-to-One Layout", fontSize: 14, textColor: "#fed7aa", textAlign: "center" } }
          ]
        },
        {
          id: "p2",
          background: "#1c1917",
          elements: [
            { id: "t3", data: { type: "text", x: 30, y: 40, width: 374, text: "Absolute Freedom", fontSize: 20, fontWeight: "bold", textColor: "#fafaf9" } },
            { id: "t4", data: { type: "text", x: 30, y: 80, width: 374, text: "The square configuration offers symmetrical canvas fields, suitable for artistic collections, gallery guides, and minimal slide portfolios.", fontSize: 13, textColor: "#d6d3d1", lineHeight: 1.5 } },
            { id: "img2", data: { type: "image", x: 30, y: 170, width: 374, height: 220, src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80", borderRadius: 8 } }
          ]
        },
        {
          id: "p3",
          background: "#ea580c",
          elements: [
            { id: "t5", data: { type: "text", x: 30, y: 180, width: 374, text: "FIN.", fontSize: 32, fontWeight: "900", textColor: "#ffffff", textAlign: "center" } }
          ]
        }
      ]
    }
  },
  invalid: {
    name: "Simulate Invalid JSON Code",
    desc: "Verify error recovery handling",
    data: "{ corrupt_data: [ missing_brackets"
  }
};

export function JsonEditorPanel() {
  const { rawJson, setRawJson, pages } = useBook();
  const [editorText, setEditorText] = useState<string>(rawJson);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [showApplyCheck, setShowApplyCheck] = useState<boolean>(false);

  // Close helper
  const closeDrawer = () => {
    const el = document.getElementById('json-panel-drawer');
    if (el) {
      el.classList.add('translate-x-full');
    }
  };

  // Validate and submit JSON editor text
  const applyJsonChange = (text: string) => {
    setEditorText(text);
    try {
      if (!text.trim()) {
        setErrorStatus("JSON cannot be empty!");
        return;
      }
      JSON.parse(text); // Check structure
      setRawJson(text);
      setErrorStatus(null);
      setShowApplyCheck(true);
      setTimeout(() => setShowApplyCheck(false), 2000);
    } catch (err: any) {
      setErrorStatus(err.message || "Invalid JSON syntax");
      // Set to trigger fallback UI in reader, but allow correcting
      setRawJson(text); 
    }
  };

  // Switch to premium pre-built layout presets
  const selectPreset = (key: string) => {
    const p = PRESETS[key];
    const dataStr = typeof p.data === 'string' ? p.data : JSON.stringify(p.data, null, 2);
    setEditorText(dataStr);
    try {
      if (key !== 'invalid') {
        JSON.parse(dataStr);
        setRawJson(dataStr);
        setErrorStatus(null);
      } else {
        setErrorStatus("SyntaxError: Unexpected token c in JSON");
        setRawJson(dataStr);
      }
    } catch (e: any) {
      setErrorStatus(e.message);
      setRawJson(dataStr);
    }
  };

  return (
    <aside
      id="json-panel-drawer"
      className="fixed right-0 top-[60px] h-[calc(100vh-120px)] w-full max-w-[420px] bg-white border-l border-slate-200 text-slate-800 shadow-2xl transition-all duration-300 transform translate-x-full z-45 flex flex-col"
    >
      {/* Header section */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold font-sans text-slate-900">Book Blueprint (JSON)</h2>
        </div>
        <button
          onClick={closeDrawer}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
          title="Collapse Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* presets selector */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-2">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans">Preset templates:</span>
          {pages === null && (
            <span className="text-[10px] text-rose-600 flex items-center gap-1 font-sans">
              <AlertTriangle className="w-3 h-3" /> Corrupted Active State
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(PRESETS).map((key) => {
            const isInvalid = key === 'invalid';
            return (
              <button
                key={key}
                onClick={() => selectPreset(key)}
                className={`py-1.5 px-2 rounded-md text-left transition-all border text-[11px] font-sans flex flex-col leading-tight cursor-pointer ${
                  isInvalid
                    ? 'border-rose-200 hover:border-rose-400 bg-rose-50 text-rose-800'
                    : 'border-slate-200 hover:border-blue-500 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold truncate">{PRESETS[key].name.split(' (')[0]}</span>
                <span className="text-[8px] opacity-75 truncate">{PRESETS[key].desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* JSON edit box */}
      <div className="flex-1 p-4 flex flex-col min-h-0 bg-white">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-sans">JSON Source Code:</span>
          <div className="flex items-center gap-1.5">
            {errorStatus ? (
              <div className="text-[10px] text-rose-600 flex items-center gap-1 font-medium font-sans">
                <AlertTriangle className="w-3 h-3" /> Syntax Error
              </div>
            ) : (
              <div className={`text-[10px] flex items-center gap-1 font-medium font-sans transition-all duration-300 ${showApplyCheck ? 'text-emerald-600 opacity-100' : 'text-emerald-500/60'}`}>
                <Check className="w-3 h-3" /> Sync Realtime
              </div>
            )}
          </div>
        </div>

        <textarea
          id="blueprint-textarea"
          value={editorText}
          onChange={(e) => applyJsonChange(e.target.value)}
          spellCheck="false"
          className={`flex-1 w-full bg-slate-50 border font-mono text-[11px] p-3 rounded-md focus:outline-none resize-none overflow-y-auto leading-relaxed transition-all text-slate-800 ${
            errorStatus 
              ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' 
              : 'border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
          }`}
          placeholder="{ 'slides': [] }"
        />
        
        {errorStatus && (
          <div className="mt-2.5 p-2.5 rounded-md bg-rose-50 border border-rose-100 text-[10px] text-rose-700 font-mono leading-normal select-none">
            {errorStatus}
          </div>
        )}
      </div>

      {/* Footer statistics */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-[10px] text-slate-500 font-mono select-none flex items-center justify-between px-4">
        <span>Normalization: slides | pages | items</span>
        {pages && <span>{pages.length} Logical Slides</span>}
      </div>
    </aside>
  );
}

export default JsonEditorPanel;
