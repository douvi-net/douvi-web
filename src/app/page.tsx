"use client";

import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { DouviWallet, getUserWallets } from "@/lib/wallets";
import { DouviTransaction, observeWalletTransactions } from "@/lib/transactions";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatComposer } from "@/components/ChatComposer";
import { sendTransaction } from "@/lib/sendTransaction";
import { createPersonalWallet } from "@/lib/wallets";
const navItems = [
  { key: "home", label: "Trang chủ", icon: "🏠" },
  { key: "chat", label: "Ví Chat", icon: "💬" },
  { key: "summary", label: "Tổng quan", icon: "📊" },
  { key: "settings", label: "Cài đặt", icon: "⚙️" },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(false);

  const [wallets, setWallets] = useState<DouviWallet[]>([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [transactions, setTransactions] = useState<DouviTransaction[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setWallets([]);
        setSelectedWalletId("");
        setTransactions([]);
        return;
      }

      try {
        setWalletLoading(true);
        const userWallets = await getUserWallets(firebaseUser.uid);
        setWallets(userWallets);

        if (userWallets.length > 0) {
          setSelectedWalletId(userWallets[0].walletId);
        }
      } catch (error) {
        console.error(error);
        setWallets([]);
      } finally {
        setWalletLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedWalletId) {
      setTransactions([]);
      return;
    }

    const unsubscribe = observeWalletTransactions(selectedWalletId, (items) => {
      setTransactions(items);
    });

    return () => unsubscribe();
  }, [selectedWalletId]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      alert("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleCreatePersonalWallet = async () => {
    if (!user) return;
  
    try {
      setWalletLoading(true);
  
      await createPersonalWallet({
        uid: user.uid,
        displayName: user.displayName || "Người dùng",
      });
  
      const userWallets = await getUserWallets(user.uid);
      setWallets(userWallets);
  
      if (userWallets.length > 0) {
        setSelectedWalletId(userWallets[0].walletId);
      }
    } finally {
      setWalletLoading(false);
    }
  };
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F8F7] p-6">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <h1 className="text-5xl font-black text-[#168768]">Douvi</h1>
          <p className="mt-4 text-slate-500">Ví chat dành cho cá nhân và cặp đôi</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#168768] px-5 py-4 text-lg font-bold text-white hover:bg-[#0F6F55]"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8F7] text-slate-900">
     <div className="mx-auto flex min-h-screen max-w-7xl pb-20 md:pb-0">
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-6 md:block">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#168768] text-xl font-black text-white">
              D
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#168768]">Douvi</h1>
              <p className="text-sm text-slate-500">Web App</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition ${
                  activeTab === item.key
                    ? "bg-[#E4F7F0] text-[#168768]"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur-xl">
            <div>
              <p className="text-sm text-slate-500">Xin chào</p>
              <h2 className="text-xl font-black">{user.displayName || "Người dùng"}</h2>
            </div>

            <button
              onClick={() => signOut(auth)}
              className="rounded-2xl border border-red-200 px-4 py-2 font-bold text-red-500 hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </header>

          <div className="flex-1 p-4 pb-28 md:p-8 md:pb-8">
            {activeTab === "home" && (
              <HomeTab
                user={user}
                wallets={wallets}
                walletLoading={walletLoading}
                selectedWalletId={selectedWalletId}
                onSelectWallet={setSelectedWalletId}
                transactions={transactions}
                onCreatePersonalWallet={handleCreatePersonalWallet}
              />
            )}

{activeTab === "chat" && (
  <ChatTab
    user={user}
    selectedWalletId={selectedWalletId}
    transactions={transactions}
  />
)}
            {activeTab === "summary" && <SummaryTab transactions={transactions} />}
            {activeTab === "settings" && <SettingsTab user={user} />}
          </div>

          <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`rounded-2xl px-2 py-2 text-xs font-bold ${
                  activeTab === item.key ? "bg-[#E4F7F0] text-[#168768]" : "text-slate-500"
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                {item.label}
              </button>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}

function HomeTab({
  user,
  wallets,
  walletLoading,
  selectedWalletId,
  onSelectWallet,
  transactions,
  onCreatePersonalWallet,
}: {
  user: User;
  wallets: DouviWallet[];
  walletLoading: boolean;
  selectedWalletId: string;
  onSelectWallet: (walletId: string) => void;
  onCreatePersonalWallet: () => Promise<void>;
  transactions: DouviTransaction[];
}) {
  const activeWallet = wallets.find((wallet) => wallet.walletId === selectedWalletId) || wallets[0];

  const totalExpense = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h2 className="text-3xl font-black">Trang chủ Douvi</h2>
      <p className="mt-2 text-slate-500">Dữ liệu ví và giao dịch đang đọc trực tiếp từ Firestore.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Card
          title="Ví hiện tại"
          value={walletLoading ? "Đang tải..." : activeWallet?.name || "Chưa có ví"}
          desc={activeWallet?.type === "couple" ? "Ví cặp đôi" : "Ví cá nhân"}
        />
        <Card title="Tổng thu" value={`${totalIncome.toLocaleString("vi-VN")}đ`} desc="Realtime từ ví đã chọn" />
        <Card title="Tổng chi" value={`${totalExpense.toLocaleString("vi-VN")}đ`} desc={user.email || ""} />
      </div>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-black">Danh sách ví</h3>

        {walletLoading ? (
          <p className="mt-4 text-slate-500">Đang tải ví...</p>
        ) : wallets.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[#F6F8F7] p-5">
            <p className="text-slate-500">
              Tài khoản này chưa có ví. Tạo ví cá nhân để bắt đầu dùng Douvi Web.
            </p>
        
            <button
              onClick={onCreatePersonalWallet}
              className="mt-4 rounded-2xl bg-[#168768] px-5 py-3 font-bold text-white hover:bg-[#0F6F55]"
            >
              Tạo ví cá nhân
            </button>
          </div>
        ): (
          <div className="mt-5 space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.walletId}
                onClick={() => onSelectWallet(wallet.walletId)}
                className={`cursor-pointer rounded-2xl border p-4 ${
                  selectedWalletId === wallet.walletId
                    ? "border-[#168768] bg-[#E4F7F0]"
                    : "border-slate-100 bg-[#F6F8F7]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-black">{wallet.name}</p>
                    <p className="text-sm text-slate-500">
                      {wallet.type === "couple" ? "Ví cặp đôi" : "Ví cá nhân"} • {wallet.memberIds.length} thành viên
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#168768]">
                    {selectedWalletId === wallet.walletId ? "Đang chọn" : "Chọn"}
                  </span>
                </div>

                {wallet.inviteCode && (
                  <p className="mt-3 text-sm text-slate-500">
                    Mã mời: <b>{wallet.inviteCode}</b>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionList
  transactions={transactions}
  walletId={selectedWalletId}
  currentUid={user.uid}
/>
    </div>
  );
}

function ChatTab({
  user,
  selectedWalletId,
  transactions,
}: {
  user: User;
  selectedWalletId: string;
  transactions: DouviTransaction[];
}) {
  return (
    <div>
      <h2 className="text-3xl font-black">Ví Chat</h2>

      <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm">
  <div className="border-b border-slate-100 p-5">
    <h2 className="text-2xl font-black">Ví Chat realtime</h2>
    <p className="mt-1 text-slate-500">
      Ghi thu chi như đang nhắn tin. Dữ liệu đồng bộ trực tiếp với app Android.
    </p>
  </div>

  <div className="max-h-[62vh] min-h-[360px] overflow-y-auto bg-[#F6F8F7] p-4">
    <TransactionList
      transactions={transactions}
      walletId={selectedWalletId}
      currentUid={user.uid}
    />
  </div>

  {selectedWalletId && (
    <ChatComposer
      onSend={async (text) => {
        await sendTransaction({
          walletId: selectedWalletId,
          text,
          uid: user.uid,
          displayName: user.displayName || "Người dùng",
        });
      }}
    />
  )}
</div>
    </div>
  );
}

function SummaryTab({ transactions }: { transactions: DouviTransaction[] }) {
  const expense = transactions.filter((item) => item.type === "EXPENSE").reduce((sum, item) => sum + item.amount, 0);
  const income = transactions.filter((item) => item.type === "INCOME").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <h2 className="text-3xl font-black">Tổng quan</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Card title="Thu nhập" value={`${income.toLocaleString("vi-VN")}đ`} desc="Tổng thu" />
        <Card title="Chi tiêu" value={`${expense.toLocaleString("vi-VN")}đ`} desc="Tổng chi" />
        <Card title="Số dư" value={`${(income - expense).toLocaleString("vi-VN")}đ`} desc="Thu - chi" />
      </div>
    </div>
  );
}

function SettingsTab({ user }: { user: User }) {
  return (
    <div>
      <h2 className="text-3xl font-black">Cài đặt</h2>
      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
        {user.photoURL && <img src={user.photoURL} alt="" className="h-20 w-20 rounded-full" />}
        <h3 className="mt-4 text-2xl font-black">{user.displayName}</h3>
<p className="text-slate-500">{user.email}</p>
<p className="mt-2 break-all text-sm text-slate-400">
  UID: {user.uid}
</p>
      </div>
    </div>
  );
}

function TransactionList({
  transactions,
  walletId,
  currentUid,
}: {
  transactions: DouviTransaction[];
  walletId: string;
  currentUid: string;
}) {
  return (
    <div className="mt-8 rounded-[2rem] bg-white p-4 shadow-sm">
      <h3 className="px-2 text-2xl font-black">Ví Chat realtime</h3>

      {transactions.length === 0 ? (
        <p className="mt-4 px-2 text-slate-500">
          Ví này chưa có giao dịch hoặc đang tải dữ liệu.
        </p>
      ) : (
        <div className="mt-5 space-y-4 rounded-[1.5rem] bg-[#F6F8F7] p-4">
          {[...transactions].reverse().map((item) => (
         <ChatBubble
         key={item.id}
         item={item}
         isMine={item.createdByUid === currentUid}
         walletId={walletId}
         currentUid={currentUid}
       />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-black text-[#168768]">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}