import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
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

function makeInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function getUserWallets(uid: string): Promise<DouviWallet[]> {
  const q = query(collection(db, "wallets"), where("memberIds", "array-contains", uid));
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

  await setDoc(doc(db, "users", uid), {
    displayName: displayName || "Người dùng",
    activeWalletId: walletId,
    updatedAt: now,
  }, { merge: true });

  return walletId;
}

export async function createCoupleWallet({
  uid,
  displayName,
  walletName,
}: {
  uid: string;
  displayName: string;
  walletName: string;
}) {
  const now = Date.now();
  const inviteCode = makeInviteCode();
  const walletRef = doc(collection(db, "wallets"));
  const walletId = walletRef.id;

  await setDoc(walletRef, {
    name: walletName.trim() || "Ví của tụi mình",
    inviteCode,
    ownerId: uid,
    memberIds: [uid],
    createdAt: now,
    type: "couple",
    kind: "couple",
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

  await setDoc(doc(db, "invite_codes", inviteCode), {
    walletId,
    ownerId: uid,
    createdAt: now,
  });

  await setDoc(doc(db, "users", uid), {
    displayName: displayName || "Người dùng",
    activeWalletId: walletId,
    updatedAt: now,
  }, { merge: true });

  return walletId;
}

export async function joinWalletByInviteCode({
  uid,
  displayName,
  inviteCode,
}: {
  uid: string;
  displayName: string;
  inviteCode: string;
}) {
  const code = inviteCode.trim().toUpperCase();
  const inviteSnap = await getDoc(doc(db, "invite_codes", code));

  if (!inviteSnap.exists()) {
    throw new Error("Mã mời không tồn tại");
  }

  const walletId = inviteSnap.data().walletId as string;
  const walletRef = doc(db, "wallets", walletId);
  const walletSnap = await getDoc(walletRef);

  if (!walletSnap.exists()) {
    throw new Error("Ví không tồn tại");
  }

  const walletData = walletSnap.data();
  const memberIds = Array.isArray(walletData.memberIds) ? walletData.memberIds : [];

  if (!memberIds.includes(uid)) {
    await updateDoc(walletRef, {
      memberIds: [...memberIds, uid],
      type: "couple",
      kind: "couple",
    });
  }

  await setDoc(doc(db, "wallets", walletId, "members", uid), {
    userId: uid,
    displayName: displayName || "Người dùng",
    avatarUrl: "",
    role: "member",
    joinedAt: Date.now(),
  });

  await setDoc(doc(db, "users", uid), {
    displayName: displayName || "Người dùng",
    activeWalletId: walletId,
    updatedAt: Date.now(),
  }, { merge: true });

  return walletId;
}