import { DouviTransaction } from "@/lib/transactions";
import { douvi } from "@/lib/douviTheme";

function formatMoney(amount: number, type: string) {
  const prefix = type === "INCOME" ? "+" : "-";
  return `${prefix}${amount.toLocaleString("vi-VN")} đ`;
}

function paymentLabel(method: string) {
  if (method === "bank") return "🏦 Ngân hàng";
  if (method === "ewallet") return "📱 Ví điện tử";
  return "💵 Tiền mặt";
}

function categoryIcon(category: string, type: string) {
  const text = category.toLowerCase();

  if (type === "INCOME") return "💰";
  if (text.includes("ăn") || text.includes("uống")) return "🍜";
  if (text.includes("xăng") || text.includes("xe") || text.includes("grab")) return "🚗";
  if (text.includes("chợ") || text.includes("mua")) return "🛍️";
  if (text.includes("điện") || text.includes("nước") || text.includes("hóa")) return "🧾";

  return "💚";
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

  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[86%] gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
          style={{ backgroundColor: isMine ? douvi.primary : "#FF9AAD" }}
        >
          {item.createdByName?.charAt(0)?.toUpperCase() || "D"}
        </div>

        <div
          className={`rounded-[24px] px-3.5 py-3 shadow-sm ${
            isMine ? "rounded-br-lg" : "rounded-bl-lg"
          }`}
          style={{
            backgroundColor: isMine ? douvi.chatMine : douvi.chatPartner,
            color: douvi.textPrimary,
          }}
        >
          <div className="flex items-start gap-2">
            <p className="flex-1 text-[15px] font-semibold leading-snug">
              {item.note || "Giao dịch"}
            </p>

            <span className="shrink-0 text-[11px]" style={{ color: douvi.textTertiary }}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>

          {isMoney && (
            <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-white/70 p-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[13px] text-lg"
                style={{
                  backgroundColor: isIncome ? douvi.incomeContainer : douvi.expenseContainer,
                }}
              >
                {categoryIcon(item.category, item.type)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs" style={{ color: douvi.textSecondary }}>
                  {item.category || "Khác"} • {paymentLabel(item.paymentMethod)}
                </p>

                <p
                  className="text-base font-black"
                  style={{ color: isIncome ? douvi.income : douvi.expense }}
                >
                  {formatMoney(item.amount, item.type)}
                </p>
              </div>
            </div>
          )}

          {item.type === "MESSAGE" && (
            <p className="mt-1 text-xs" style={{ color: douvi.textSecondary }}>
              Tin nhắn
            </p>
          )}
        </div>
      </div>
    </div>
  );
}