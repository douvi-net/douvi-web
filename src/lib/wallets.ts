import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  
  export type DouviWallet = {
    walletId: string;
    name: string;
    type: "personal" | "couple";
    ownerId: string;
    memberIds: string[];
    inviteCode?: string;
  };
  
  function mapWallet(docId: string, data: any): DouviWallet {
    return {
      walletId: docId,
      name: data.name || "Ví Douvi",
      type: data.type || "personal",
      ownerId: data.ownerId || "",
      memberIds: data.memberIds || [],
      inviteCode: data.inviteCode || "",
    };
  }
  
  export async function getUserWallets(uid: string): Promise<DouviWallet[]> {
    const result = new Map<string, DouviWallet>();
  
    const userDoc = await getDoc(doc(db, "users", uid));
    const activeWalletId = userDoc.exists()
      ? userDoc.data().activeWalletId || ""
      : "";
  
    if (activeWalletId) {
      const activeWalletDoc = await getDoc(doc(db, "wallets", activeWalletId));
  
      if (activeWalletDoc.exists()) {
        result.set(
          activeWalletDoc.id,
          mapWallet(activeWalletDoc.id, activeWalletDoc.data())
        );
      }
    }
  
    const q = query(
      collection(db, "wallets"),
      where("memberIds", "array-contains", uid)
    );
  
    const snapshot = await getDocs(q);
  
    snapshot.docs.forEach((walletDoc) => {
      result.set(walletDoc.id, mapWallet(walletDoc.id, walletDoc.data()));
    });
  
    return Array.from(result.values());
  }