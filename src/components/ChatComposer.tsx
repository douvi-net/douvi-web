"use client";

import { useState } from "react";

export function ChatComposer({
  onSend,
}: {
  onSend: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const clean = text.trim();

    if (!clean) return;

    try {
      setLoading(true);
      await onSend(clean);
      setText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sticky bottom-0 mt-4 border-t border-slate-100 bg-white p-3">
      <div className="flex items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4F7F0] text-xl text-[#168768]">
          +
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gõ tự nhiên: ăn sáng 50k..."
          className="h-11 flex-1 rounded-full bg-[#F6F8F7] px-4 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#168768] text-white"
        >
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}