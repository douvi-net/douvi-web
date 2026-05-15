import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

function detectType(text: string) {
  const lower = text.toLowerCase();

  if (
    lower.includes("lương") ||
    lower.includes("thưởng") ||
    lower.includes("được cho") ||
    lower.includes("thu")
  ) {
    return "INCOME";
  }

  return "EXPENSE";
}

function extractAmount(text: string) {
  const match = text.match(/\d+/g);

  if (!match) return 0;

  const raw = match.join("");

  if (text.toLowerCase().includes("tr")) {
    return parseInt(raw) * 1000000;
  }

  if (text.toLowerCase().includes("k")) {
    return parseInt(raw) * 1000;
  }

  return parseInt(raw);
}

function detectCategory(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("ăn")) return "Ăn uống";
  if (lower.includes("xăng")) return "Di chuyển";
  if (lower.includes("lương")) return "Lương";

  return "Khác";
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

  await addDoc(collection(db, "wallets", walletId, "transactions"), {
    transactionId: now,
    walletId,
    type: detectType(text),
    amount: extractAmount(text),
    category: detectCategory(text),
    note: text,
    paymentMethod: "cash",
    createdAt: now,
    updatedAt: now,
    createdByUid: uid,
    createdByName: displayName || "Người dùng",
  });
}