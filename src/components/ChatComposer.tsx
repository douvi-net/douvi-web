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
    <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 p-3 backdrop-blur">
      <div className="flex items-center gap-2 rounded-full bg-[#F6F8F7] p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Gõ: ăn sáng 50k, nhận lương 10tr..."
          className="h-11 flex-1 bg-transparent px-3 text-[15px] outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#168768] font-bold text-white disabled:opacity-40"
        >
          {loading ? "…" : "➤"}
        </button>
      </div>
    </div>
  );
}