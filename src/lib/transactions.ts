import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type DouviTransaction = {
  id: string;
  transactionId: number;
  walletId: string;
  type: "EXPENSE" | "INCOME" | "MESSAGE";
  amount: number;
  category: string;
  note: string;
  paymentMethod: string;
  createdAt: number;
  updatedAt: number;
  createdByUid: string;
  createdByName: string;
  imagePath?: string | null;
  isPinned?: boolean;
  reactions?: string | null;
};

function normalizeReactionString(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    return value.trim() ? value : null;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value);
  }

  return null;
}

export function observeWalletTransactions(
  walletId: string,
  callback: (items: DouviTransaction[]) => void
) {
  const q = query(
    collection(db, "wallets", walletId, "transactions"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        transactionId: Number(data.transactionId || 0),
        walletId: String(data.walletId || walletId),
        type: data.type === "INCOME" || data.type === "MESSAGE" ? data.type : "EXPENSE",
        amount: Number(data.amount || 0),
        category: String(data.category || ""),
        note: String(data.note || ""),
        paymentMethod: String(data.paymentMethod || "cash"),
        createdAt: Number(data.createdAt || 0),
        updatedAt: Number(data.updatedAt || 0),
        createdByUid: String(data.createdByUid || ""),
        createdByName: String(data.createdByName || "Người dùng"),
        imagePath: data.imagePath ? String(data.imagePath) : null,
        isPinned: Boolean(data.isPinned || false),
        reactions: normalizeReactionString(data.reactions),
      };
    });

    callback(items);
  });
}