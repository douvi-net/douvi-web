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
        walletId: data.walletId || walletId,
        type: data.type || "EXPENSE",
        amount: Number(data.amount || 0),
        category: data.category || "",
        note: data.note || "",
        paymentMethod: data.paymentMethod || "cash",
        createdAt: Number(data.createdAt || 0),
        updatedAt: Number(data.updatedAt || 0),
        createdByUid: data.createdByUid || "",
        createdByName: data.createdByName || "Người dùng",
        imagePath: data.imagePath || null,
        isPinned: Boolean(data.isPinned || false),
        reactions:
          typeof data.reactions === "string"
            ? data.reactions
            : data.reactions
            ? JSON.stringify(data.reactions)
            : null,
      };
    });

    callback(items);
  });
}