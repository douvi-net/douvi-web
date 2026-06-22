import {
    doc,
    onSnapshot,
    setDoc,
  } from "firebase/firestore";
  
  import { db } from "@/lib/firebase";
  
  export async function markWalletSeen(
    walletId: string,
    uid: string
  ) {
    await setDoc(
      doc(db, "wallets", walletId, "seen", uid),
      {
        uid,
        seenAt: Date.now(),
      },
      { merge: true }
    );
  }
  
  export function observeSeen(
    walletId: string,
    uid: string,
    callback: (seenAt: number) => void
  ) {
    return onSnapshot(
      doc(db, "wallets", walletId, "seen", uid),
      (snap) => {
        callback(
          Number(snap.data()?.seenAt || 0)
        );
      }
    );
  }