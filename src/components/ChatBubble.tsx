import { DouviTransaction } from "@/lib/transactions";

function formatMoney(amount: number, type: string) {
  const prefix = type === "INCOME" ? "+" : "-";
  return `${prefix}${amount.toLocaleString("vi-VN")}đ`;
}

function paymentLabel(method: string) {
  if (method === "bank") return "🏦 Ngân hàng";
  if (method === "ewallet") return "📱 Ví điện tử";
  return "💵 Tiền mặt";
}

function parseReactionMap(reactions?: string | null): Record<string, string> {
  if (!reactions) return {};

  try {
    const parsed = JSON.parse(reactions);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function reactionEmoji(reactions?: string | null) {
  const map = parseReactionMap(reactions);
  const first = Object.values(map)[0];

  if (first === "LIKE") return "👍";
  if (first === "LOVE") return "❤️";
  if (first === "HAHA") return "😂";
  if (first === "WOW") return "😮";
  if (first === "ANGRY") return "😡";

  return "";
}

export function ChatBubble({
  item,
  isMine,
}: {
  item: DouviTransaction;
  isMine: boolean;
  walletId: string;
  currentUid: string;
}) {
  const isMoney = item.amount > 0;
  const isIncome = item.type === "INCOME";
  const emoji = reactionEmoji(item.reactions);

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[82%] gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#168768] text-sm font-black text-white">
          {item.createdByName?.charAt(0)?.toUpperCase() || "D"}
        </div>

        <div className="relative">
          <div
            className={`rounded-[1.5rem] px-4 py-3 shadow-sm ${
              isMine ? "bg-[#D8F3E9]" : "bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold text-slate-900">{item.note || "Giao dịch"}</p>

              <span className="text-xs text-slate-400">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>

            {item.imagePath && (
              <img
                src={item.imagePath}
                alt="receipt"
                className="mt-3 max-h-56 w-full rounded-2xl object-cover"
              />
            )}

            {isMoney && (
              <div className="mt-3 rounded-2xl bg-white/70 p-3">
                <p className="text-sm text-slate-500">
                  {item.category || "khác"} • {paymentLabel(item.paymentMethod)}
                </p>

                <p
                  className={`mt-1 text-xl font-black ${
                    isIncome ? "text-[#168768]" : "text-red-500"
                  }`}
                >
                  {formatMoney(item.amount, item.type)}
                </p>
              </div>
            )}

            {item.type === "MESSAGE" && (
              <p className="mt-2 text-sm text-slate-500">Tin nhắn</p>
            )}
          </div>

          {emoji && (
            <div
              className={`absolute -bottom-3 rounded-full bg-white px-2 py-1 text-sm shadow ${
                isMine ? "left-3" : "right-3"
              }`}
            >
              {emoji}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}