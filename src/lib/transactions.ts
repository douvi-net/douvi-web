import {
    collection,
    onSnapshot,
    orderBy,
    query,
  } from "firebase/firestore";
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
    createdByName: string;
    imagePath?: string;
    isPinned?: boolean;
    reactions?: Record<string, string>;
createdByUid?: string;
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
          transactionId: data.transactionId || 0,
          walletId: data.walletId || walletId,
          type: data.type || "EXPENSE",
          amount: data.amount || 0,
          category: data.category || "",
          note: data.note || "",
          paymentMethod: data.paymentMethod || "cash",
          createdAt: data.createdAt || 0,
          updatedAt: data.updatedAt || 0,
          createdByName: data.createdByName || "Người dùng",
          imagePath: data.imagePath || "",
          isPinned: data.isPinned || false,
          createdByUid: data.createdByUid || "",
reactions: data.reactions || {},
        };
      });
  
      callback(items);
    });
  }