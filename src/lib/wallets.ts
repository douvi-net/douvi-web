import {
    collection,
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
  
  export async function getUserWallets(uid: string): Promise<DouviWallet[]> {
    const q = query(
      collection(db, "wallets"),
      where("memberIds", "array-contains", uid)
    );
  
    const snapshot = await getDocs(q);
  
    return snapshot.docs.map((walletDoc) => {
      const data = walletDoc.data();
  
      return {
        walletId: walletDoc.id,
        name: data.name || "Ví Douvi",
        type: data.type || "personal",
        ownerId: data.ownerId || "",
        memberIds: data.memberIds || [],
        inviteCode: data.inviteCode || "",
      };
    });
  }