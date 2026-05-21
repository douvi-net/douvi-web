import { doc, getDoc, updateDoc } from "firebase/firestore";
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
  const snap = await getDoc(ref);
  const current = snap.data()?.reactions;

  let reactionMap: Record<string, string> = {};

  if (typeof current === "string" && current.trim()) {
    try {
      reactionMap = JSON.parse(current);
    } catch {
      reactionMap = {};
    }
  }

  if (current && typeof current === "object" && !Array.isArray(current)) {
    reactionMap = current as Record<string, string>;
  }

  reactionMap[uid] = reaction;

  await updateDoc(ref, {
    reactions: JSON.stringify(reactionMap),
    updatedAt: Date.now(),
  });
}