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



export function ChatBubble({
  item,
  isMine,
}: {
  item: DouviTransaction;
  isMine: boolean;
}) {
  const isMoney = item.amount > 0;
  const isIncome = item.type === "INCOME";



  return (
    <div
      className={`flex items-end gap-2 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {!isMine && (
        <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#168768] text-sm font-black text-white shadow-sm">
          {item.createdByName?.charAt(0)?.toUpperCase() || "D"}
        </div>
      )}

      <div className="relative max-w-[82%]">
        <div
          className={`rounded-[28px] px-4 py-3 shadow-sm transition-all ${
            isMine
              ? "rounded-br-[10px]"
              : "rounded-bl-[10px]"
          }`}
          style={{
            background: isMine
              ? "linear-gradient(135deg,#D8F3E9 0%,#EAF6F2 100%)"
              : "#FFFFFF",
            boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="break-words text-[15px] font-black leading-relaxed text-[#17231F]">
              {item.note || "Giao dịch"}
            </p>

            <span className="shrink-0 pt-1 text-[11px] text-[#8A9993]">
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
              className="mt-3 max-h-72 w-full rounded-[22px] object-cover"
            />
          )}

          {isMoney && (
            <div
              className="mt-3 rounded-[22px] p-3"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <p className="text-xs font-semibold text-[#62736D]">
                {item.category || "Khác"} •{" "}
                {paymentLabel(item.paymentMethod)}
              </p>

              <p
                className="mt-1 text-[28px] font-black tracking-tight"
                style={{
                  color: isIncome ? "#21966B" : "#E05F58",
                }}
              >
                {formatMoney(item.amount, item.type)}
              </p>
            </div>
          )}

          {item.type === "MESSAGE" && (
            <p className="mt-2 text-xs text-[#8A9993]">Tin nhắn</p>
          )}

      {/* Reaction tạm ẩn trên web để tránh ghi sai dữ liệu Android */}
      </div>
      </div>

      {isMine && (
        <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8F3E9] text-sm font-black text-[#168768] shadow-sm">
          {item.createdByName?.charAt(0)?.toUpperCase() || "T"}
        </div>
      )}
    </div>
  );
}