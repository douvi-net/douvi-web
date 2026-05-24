"use client";

import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import {
  DouviWallet,
  getUserWallets,
  createPersonalWallet,
  createCoupleWallet,
  joinWalletByInviteCode,
} from "@/lib/wallets";
import { DouviTransaction, observeWalletTransactions } from "@/lib/transactions";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatComposer } from "@/components/ChatComposer";
import { sendTransaction } from "@/lib/sendTransaction";
import { douvi } from "@/lib/douviTheme";

const navItems = [
  { key: "home", label: "Trang chủ", icon: "🏠" },
  { key: "chat", label: "Ví Chat", icon: "💬" },
  { key: "wallet", label: "Ví", icon: "👛" },
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
      <main className="flex min-h-screen items-center justify-center bg-[#F6F8F7] p-5">
        <div className="w-full max-w-md rounded-[1.6rem] bg-white p-8 text-center shadow-xl">
        <h1 className="text-[24px] font-black leading-tight text-[#168768]">Douvi</h1>
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
    <div className="min-h-screen" style={{ backgroundColor: douvi.background }}>
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-5 md:block">
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
        <DouviMobileTopBar
  title={
    wallets.find((w) => w.walletId === selectedWalletId)?.name || "Douvi"
  }
  subtitle={
    wallets.find((w) => w.walletId === selectedWalletId)?.type === "couple"
      ? "Ví chung của tụi mình"
      : "Ví cá nhân"
  }
  user={user}
/>

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
  wallets={wallets}
  transactions={transactions}
/>
)}
        {activeTab === "wallet" && (
  <WalletHubTab
    user={user}
    wallets={wallets}
    selectedWalletId={selectedWalletId}
    onWalletsReload={async () => {
      const fresh = await getUserWallets(user.uid);
      setWallets(fresh);
      if (fresh.length > 0) setSelectedWalletId(fresh[0].walletId);
    }}
  />
)}

{activeTab === "summary" && <SummaryTab transactions={transactions} />}

{activeTab === "settings" && (
  <SettingsTab
    user={user}
    wallets={wallets}
    selectedWalletId={selectedWalletId}
  />
)}
          </div>

          <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-5 rounded-[28px] border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`rounded-2xl px-2 py-2 text-[11px] font-bold transition ${
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

      <div className="mt-8 rounded-[1.6rem] bg-white p-5 shadow-sm">
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
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
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
  wallets,
  transactions,
}: {
  user: any;
  selectedWalletId: string;
  wallets: DouviWallet[];
  transactions: DouviTransaction[];
}) {
  const wallet = wallets.find((w) => w.walletId === selectedWalletId);

  return (
    <main className="flex h-[calc(100vh-130px)] flex-col">
      <div
        className="flex items-center gap-3 border-b px-4 py-3"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5ECE8",
        }}
      >
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6F2] text-lg font-black text-[#168768]">
            {wallet?.name?.charAt(0)?.toUpperCase() || "D"}
          </div>

          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22C55E]" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] font-black text-[#17231F]">
            {wallet?.name || "Ví Douvi"}
          </h2>

          <p className="truncate text-xs text-[#62736D]">
            {wallet?.type === "couple"
              ? "Ví cặp đôi đang hoạt động"
              : "Ví cá nhân"}{" "}
            · Online
          </p>
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F8F5] text-lg">
          📞
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F8F5] text-lg">
          ⋮
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto px-3 py-4"
        style={{
          backgroundColor: "#F8FBF9",
        }}
      >
        {transactions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF6F2] text-4xl">
              💬
            </div>

            <h3 className="mt-5 text-xl font-black text-[#17231F]">
              Chưa có giao dịch
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-[#62736D]">
              Hãy thử nhắn như đang chat:
              <br />
              “ăn sáng 50k”
              <br />
              “đổ xăng 100k”
              <br />
              “lương tháng 10tr”
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((item) => (
              <ChatBubble
                key={item.id}
                item={item}
                walletId={selectedWalletId}
                currentUid={user.uid}
                isMine={item.createdByUid === user.uid}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className="border-t"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5ECE8",
        }}
      >
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
      </div>
    </main>
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

function SettingsTab({
  user,
  wallets,
  selectedWalletId,
}: {
  user: User;
  wallets: DouviWallet[];
  selectedWalletId: string;
}) {
  const wallet = wallets.find((w) => w.walletId === selectedWalletId);

  return (
    <main className="space-y-4 px-4 pb-28 pt-4">
      <section className="rounded-[28px] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F7F0] text-2xl font-black text-[#168768]">
            {user?.displayName?.charAt(0)?.toUpperCase() || "D"}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-black text-[#17231F]">
              {user?.displayName || "Người dùng"}
            </h2>
            <p className="truncate text-sm text-[#62736D]">
              {user?.email || "Chưa có email"}
            </p>

            <div className="mt-2 inline-flex rounded-full bg-[#EEF5F1] px-3 py-1 text-xs font-bold text-[#168768]">
              Đang hoạt động
            </div>
          </div>
        </div>
      </section>

      <SettingsSection title="Ví chung">
        <SettingsRow
          icon="👛"
          title="Thông tin ví"
          subtitle={wallet?.name || "Chưa có ví"}
          value={wallet?.type === "couple" ? "Ví đôi" : "Cá nhân"}
        />

        <SettingsRow
          icon="👥"
          title="Thành viên"
          subtitle={
            wallet?.type === "couple"
              ? `${wallet.memberIds.length} thành viên`
              : "1 thành viên"
          }
          value="Xem"
        />

        <SettingsRow
          icon="🔑"
          title="Mã mời"
          subtitle={wallet?.inviteCode || "Không có"}
          value={wallet?.inviteCode ? "Copy" : ""}
        />
      </SettingsSection>

      <SettingsSection title="Tài khoản của bạn">
        <SettingsRow
          icon="👤"
          title="Thông tin cá nhân"
          subtitle="Quản lý hồ sơ và tài khoản"
          value=">"
        />

        <SettingsRow
          icon="🔒"
          title="Bảo mật"
          subtitle="Đăng nhập, dữ liệu và quyền riêng tư"
          value=">"
        />

        <SettingsRow
          icon="🔔"
          title="Thông báo"
          subtitle="Quản lý nhắc nhở và thông báo"
          value="Tắt"
        />
      </SettingsSection>

      <SettingsSection title="Tùy chỉnh ứng dụng">
        <SettingsRow
          icon="🎨"
          title="Giao diện"
          subtitle="Tùy chỉnh màu sắc và chế độ hiển thị"
          value="Sáng"
        />

        <SettingsRow
          icon="💵"
          title="Đơn vị tiền tệ"
          subtitle="VND - Việt Nam Đồng"
          value="VND"
        />

        <SettingsRow
          icon="🌐"
          title="Ngôn ngữ"
          subtitle="Tiếng Việt"
          value="VI"
        />
      </SettingsSection>

      <SettingsSection title="Hỗ trợ">
        <SettingsRow
          icon="💚"
          title="Douvi Hạnh Phúc"
          subtitle="Mở khóa báo cáo nâng cao và tính năng ví đôi"
          value="Pro"
        />

        <SettingsRow
          icon="❓"
          title="Trung tâm trợ giúp"
          subtitle="Câu hỏi thường gặp và hỗ trợ"
          value=">"
        />

        <SettingsRow
          icon="ℹ️"
          title="Giới thiệu Douvi"
          subtitle="Douvi Web App"
          value="1.0"
        />
      </SettingsSection>

      <button
        onClick={() => auth.signOut()}
        className="w-full rounded-[22px] border border-red-200 bg-white py-4 font-black text-red-500 shadow-sm"
      >
        Đăng xuất
      </button>
    </main>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 px-1 text-sm font-black text-[#62736D]">
        {title}
      </h3>

      <div className="overflow-hidden rounded-[26px] bg-white shadow-sm">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  value,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#EEF5F1] p-4 last:border-b-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#E4F7F0] text-xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-black text-[#17231F]">{title}</p>
        <p className="mt-0.5 truncate text-sm text-[#62736D]">{subtitle}</p>
      </div>

      {value && (
        <span className="shrink-0 text-sm font-black text-[#8A9993]">
          {value}
        </span>
      )}
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
    <div className="mt-8 rounded-[1.6rem] bg-white p-4 shadow-sm">
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
    <div className="rounded-[1.6rem] bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-black text-[#168768]">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
function DouviMobileTopBar({
  title,
  subtitle,
  user,
}: {
  title: string;
  subtitle?: string;
  user: any;
}) {
  return (
    <header
      className="sticky top-0 z-40 flex h-[58px] items-center gap-3 border-b px-4"
      style={{
        backgroundColor: douvi.background,
        borderColor: douvi.border,
        boxShadow: "0 10px 40px rgba(15,23,42,0.12)",
backdropFilter: "blur(18px)",
      }}
    >
      <div className="relative flex h-10 w-14 items-center">
        <div className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F3]">
          💚
        </div>

        <div
          className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black"
          style={{
            backgroundColor: douvi.primarySoft,
            color: douvi.primary,
          }}
        >
          {user?.displayName?.charAt(0)?.toUpperCase() || "D"}
        </div>

        <span
          className="absolute bottom-0 right-1 z-20 h-3 w-3 rounded-full border-2 border-white"
          style={{ backgroundColor: douvi.primary }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h1
          className="truncate text-[18px] font-black"
          style={{ color: douvi.textPrimary }}
        >
          {title}
        </h1>

        <p
          className="truncate text-xs"
          style={{ color: douvi.textSecondary }}
        >
          {subtitle} · Online
        </p>
      </div>

      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        🔍
      </button>

      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        🔔
      </button>
    </header>
  );
}
function WalletHubTab({
  user,
  wallets,
  selectedWalletId,
  onWalletsReload,
}: {
  user: any;
  wallets: DouviWallet[];
  selectedWalletId: string;
  onWalletsReload: () => Promise<void>;
}) {
  const [walletName, setWalletName] = useState("Ví của tụi mình");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const currentWallet = wallets.find((w) => w.walletId === selectedWalletId);

  async function handleCreateCoupleWallet() {
    try {
      setLoading(true);
      await createCoupleWallet({
        uid: user.uid,
        displayName: user.displayName || "Người dùng",
        walletName,
      });
      await onWalletsReload();
      alert("Đã tạo ví đôi");
    } catch (e: any) {
      alert(e.message || "Tạo ví thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinWallet() {
    try {
      setLoading(true);
      await joinWalletByInviteCode({
        uid: user.uid,
        displayName: user.displayName || "Người dùng",
        inviteCode,
      });
      await onWalletsReload();
      alert("Đã tham gia ví");
    } catch (e: any) {
      alert(e.message || "Tham gia ví thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-4 px-4 pb-28 pt-4">
      <section
        className="rounded-[28px] p-5 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #D8F3E9 0%, #F8FBF9 100%)",
        }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          👛
        </div>

        <h1 className="mt-4 text-2xl font-black text-[#17231F]">
          Bạn muốn bắt đầu với ví nào?
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#62736D]">
          Douvi có thể dùng một mình hoặc dùng chung với người bạn tin tưởng.
        </p>
      </section>
      <section className="rounded-[28px] bg-white p-4 shadow-sm">
  <div className="flex items-start gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#E4F7F0] text-xl">
      👤
    </div>

    <div className="flex-1">
      <h2 className="font-black text-[#17231F]">Ví cá nhân</h2>
      <p className="mt-1 text-sm text-[#62736D]">
        Dùng một mình để ghi thu chi riêng, không cần mã mời.
      </p>
    </div>
  </div>

  <button
    onClick={async () => {
      try {
        setLoading(true);

        await createPersonalWallet({
          uid: user.uid,
          displayName: user.displayName || "Người dùng",
        });

        await onWalletsReload();
        alert("Đã tạo ví cá nhân");
      } catch (e: any) {
        alert(e.message || "Tạo ví cá nhân thất bại");
      } finally {
        setLoading(false);
      }
    }}
    disabled={loading}
    className="mt-4 w-full rounded-[20px] bg-[#168768] py-3 font-black text-white disabled:opacity-40"
  >
    {loading ? "Đang tạo ví..." : "Tạo ví cá nhân"}
  </button>
</section>
      {currentWallet && (
        <section className="rounded-[28px] bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-[#62736D]">Ví hiện tại</p>
          <h2 className="mt-1 text-xl font-black text-[#17231F]">
            {currentWallet.name}
          </h2>
          <p className="mt-1 text-sm text-[#62736D]">
            {currentWallet.type === "couple"
              ? `Ví cặp đôi • Mã mời ${currentWallet.inviteCode || "---"}`
              : "Ví cá nhân"}
          </p>
        </section>
      )}

      <section className="rounded-[28px] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#E4F7F0] text-xl">
            💚
          </div>

          <div className="flex-1">
            <h2 className="font-black text-[#17231F]">Tạo ví dùng chung</h2>
            <p className="mt-1 text-sm text-[#62736D]">
              Cùng nhau ghi thu chi, minh bạch nhẹ nhàng.
            </p>
          </div>
        </div>

        <input
          value={walletName}
          onChange={(e) => setWalletName(e.target.value.slice(0, 40))}
          className="mt-4 h-12 w-full rounded-[20px] border px-4 outline-none"
          style={{ borderColor: "#DDEAE4" }}
          placeholder="Tên ví cặp đôi"
        />

        <button
          onClick={handleCreateCoupleWallet}
          disabled={loading || !walletName.trim()}
          className="mt-3 w-full rounded-[20px] bg-[#168768] py-3 font-black text-white disabled:opacity-40"
        >
          {loading ? "Đang xử lý..." : "Tạo ví chung"}
        </button>
      </section>

      <section className="rounded-[28px] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#FFF4DA] text-xl">
            🔑
          </div>

          <div className="flex-1">
            <h2 className="font-black text-[#17231F]">Đã có mã mời?</h2>
            <p className="mt-1 text-sm text-[#62736D]">
              Nhập mã để tham gia ví cặp đôi của người kia.
            </p>
          </div>
        </div>

        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 10))}
          className="mt-4 h-12 w-full rounded-[20px] border px-4 font-black uppercase tracking-widest outline-none"
          style={{ borderColor: "#DDEAE4" }}
          placeholder="MÃ MỜI"
        />

        <button
          onClick={handleJoinWallet}
          disabled={loading || !inviteCode.trim()}
          className="mt-3 w-full rounded-[20px] bg-[#168768] py-3 font-black text-white disabled:opacity-40"
        >
          {loading ? "Đang tham gia..." : "Tham gia ví"}
        </button>
      </section>
    </main>
  );
}