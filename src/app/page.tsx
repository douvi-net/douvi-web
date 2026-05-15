"use client";

import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { DouviWallet, getUserWallets } from "@/lib/wallets";
import { DouviTransaction, observeWalletTransactions } from "@/lib/transactions";
import { ChatBubble } from "@/components/ChatBubble";
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
      <div className="mx-auto flex min-h-screen max-w-7xl">
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

          <div className="flex-1 p-5 pb-24 md:p-8">
            {activeTab === "home" && (
              <HomeTab
                user={user}
                wallets={wallets}
                walletLoading={walletLoading}
                selectedWalletId={selectedWalletId}
                onSelectWallet={setSelectedWalletId}
                transactions={transactions}
              />
            )}

            {activeTab === "chat" && <ChatTab transactions={transactions} />}
            {activeTab === "summary" && <SummaryTab transactions={transactions} />}
            {activeTab === "settings" && <SettingsTab user={user} />}
          </div>

          <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-4 border-t border-slate-200 bg-white p-2 md:hidden">
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
}: {
  user: User;
  wallets: DouviWallet[];
  walletLoading: boolean;
  selectedWalletId: string;
  onSelectWallet: (walletId: string) => void;
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
          <p className="mt-4 text-slate-500">Tài khoản này chưa có ví hoặc chưa được thêm vào ví nào.</p>
        ) : (
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

      <TransactionList transactions={transactions} />
    </div>
  );
}

function ChatTab({ transactions }: { transactions: DouviTransaction[] }) {
  return (
    <div>
      <h2 className="text-3xl font-black">Ví Chat</h2>
      <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
        <TransactionList transactions={transactions} />
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
      </div>
    </div>
  );
}

function TransactionList({ transactions }: { transactions: DouviTransaction[] }) {
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
              isMine={false}
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