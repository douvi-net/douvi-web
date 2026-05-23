import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ReactionCode = "LIKE" | "LOVE" | "HAHA" | "WOW" | "ANGRY";

function normalizeReactions(value: unknown): Record<string, string> {
  if (!value) return {};

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, string>)
        : {};
    } catch {
      return {};
    }
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }

  return {};
}

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
    console.warn("Missing reaction params", { walletId, transactionId, uid });
    return;
  }

  const ref = doc(db, "wallets", walletId, "transactions", transactionId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const reactionMap = normalizeReactions(snap.data().reactions);
  reactionMap[uid] = reaction;

  await updateDoc(ref, {
    reactions: JSON.stringify(reactionMap),
    updatedAt: Date.now(),
  });
}