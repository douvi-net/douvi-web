import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
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

export async function createPersonalWallet({
  uid,
  displayName,
}: {
  uid: string;
  displayName: string;
}) {
  const now = Date.now();
  const walletRef = doc(collection(db, "wallets"));
  const walletId = walletRef.id;

  await setDoc(walletRef, {
    name: "Ví cá nhân của tôi",
    inviteCode: "",
    ownerId: uid,
    memberIds: [uid],
    createdAt: now,
    type: "personal",
    goalName: "",
    goalTarget: 0,
    goalSaved: 0,
  });

  await setDoc(doc(db, "wallets", walletId, "members", uid), {
    userId: uid,
    displayName: displayName || "Người dùng",
    avatarUrl: "",
    role: "owner",
    joinedAt: now,
  });

  await setDoc(
    doc(db, "users", uid),
    {
      displayName: displayName || "Người dùng",
      activeWalletId: walletId,
      updatedAt: now,
    },
    { merge: true }
  );

  return walletId;
}