"use client";

import { useState } from "react";
import { douvi } from "@/lib/douviTheme";

export function ChatComposer({
  onSend,
}: {
  onSend: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const quickTexts = ["ăn uống 50k", "xăng xe 100k", "đi chợ 100k", "hóa đơn 500k"];

  async function handleSend() {
    const clean = text.trim();
    if (!clean || loading) return;

    try {
      setLoading(true);
      await onSend(clean);
      setText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="border-t px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2"
      style={{ backgroundColor: douvi.background, borderColor: douvi.border }}
    >
      <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
        {quickTexts.map((item) => (
          <button
            key={item}
            onClick={() => setText(item)}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm"
            style={{ color: douvi.textPrimary }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl font-bold"
          style={{ backgroundColor: douvi.primarySoft, color: douvi.primary }}
        >
          +
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gõ tự nhiên: ăn sáng 50k..."
          className="h-10 flex-1 rounded-full px-4 text-sm outline-none"
          style={{ backgroundColor: douvi.surfaceSoft, color: douvi.textPrimary }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white disabled:opacity-40"
          style={{ backgroundColor: douvi.primary }}
        >
          {loading ? "…" : "➤"}
        </button>
      </div>
    </div>
  );
}