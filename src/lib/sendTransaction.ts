import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function normalizeText(text: string) {
  return text.toLowerCase().trim();
}

function detectType(text: string) {
  const lower = normalizeText(text);

  if (
    lower.includes("lương") ||
    lower.includes("thu nhập") ||
    lower.includes("được cho") ||
    lower.includes("thưởng") ||
    lower.includes("nhận") ||
    lower.includes("kiếm")
  ) {
    return "INCOME";
  }

  return "EXPENSE";
}

function extractAmount(text: string) {
  const lower = normalizeText(text);
  const match = lower.match(/(\d+([.,]\d+)?)/);

  if (!match) return 0;

  const number = parseFloat(match[1].replace(",", "."));

  if (lower.includes("tr") || lower.includes("triệu")) {
    return Math.round(number * 1000000);
  }

  if (lower.includes("k") || lower.includes("nghìn") || lower.includes("ngàn")) {
    return Math.round(number * 1000);
  }

  return Math.round(number);
}

function detectCategory(text: string) {
  const lower = normalizeText(text);

  if (lower.includes("ăn") || lower.includes("uống") || lower.includes("cafe") || lower.includes("cà phê")) {
    return "Ăn uống";
  }

  if (lower.includes("xăng") || lower.includes("grab") || lower.includes("taxi") || lower.includes("xe")) {
    return "Di chuyển";
  }

  if (lower.includes("chợ") || lower.includes("siêu thị") || lower.includes("mua đồ")) {
    return "Gia đình";
  }

  if (lower.includes("điện") || lower.includes("nước") || lower.includes("wifi") || lower.includes("nhà")) {
    return "Hóa đơn";
  }

  if (lower.includes("lương") || lower.includes("thưởng")) {
    return "Lương";
  }

  return "Khác";
}

function detectPaymentMethod(text: string) {
  const lower = normalizeText(text);

  if (lower.includes("bank") || lower.includes("chuyển khoản") || lower.includes("ck") || lower.includes("qr")) {
    return "bank";
  }

  if (lower.includes("momo") || lower.includes("zalopay") || lower.includes("ví điện tử")) {
    return "ewallet";
  }

  return "cash";
}

export async function sendTransaction({
  walletId,
  text,
  uid,
  displayName,
}: {
  walletId: string;
  text: string;
  uid: string;
  displayName: string;
}) {
  const now = Date.now();
  const transactionId = now;

  const cleanText = text.trim().slice(0, 300);
  const amount = extractAmount(cleanText);
  const type = amount > 0 ? detectType(cleanText) : "MESSAGE";

  await setDoc(doc(db, "wallets", walletId, "transactions", String(transactionId)), {
    transactionId,
    walletId,
    type,
    amount,
    category: type === "MESSAGE" ? "" : detectCategory(cleanText),
    note: cleanText,
    comment: null,
    commentBy: null,
    reactions: null,
    imagePath: null,
    replyToId: null,
    replyPreview: null,
    paymentMethod: detectPaymentMethod(cleanText),
    isPinned: false,
    createdAt: now,
    updatedAt: now,
    createdByUid: uid,
    createdByName: displayName || "Người dùng",
  });
}