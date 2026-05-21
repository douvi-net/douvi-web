import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ReactionCode = "LIKE" | "LOVE" | "HAHA" | "WOW" | "ANGRY";

export async function setTransactionReaction({
  walletId,
  transactionId,
  uid,
  reaction,
}: {
  walletId: string;
  transactionId: string;
  uid: string;
  reaction: ReactionCode;
}) {
  if (!walletId || !transactionId || !uid) {
    console.warn("Missing reaction params", {
      walletId,
      transactionId,
      uid,
      reaction,
    });
    return;
  }

  const ref = doc(db, "wallets", walletId, "transactions", transactionId);

  await updateDoc(ref, {
    [`reactions.${uid}`]: reaction,
    updatedAt: Date.now(),
  });
}