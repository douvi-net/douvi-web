export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F8F7] text-slate-900">
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-200/40 blur-3xl" />

<div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-teal-200/40 blur-3xl" />
<header className="sticky top-0 z-50 mb-8 flex items-center justify-between rounded-full border border-white/40 bg-white/70 px-5 py-4 backdrop-blur-xl">
<div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#168768] text-lg font-bold text-white shadow-lg shadow-emerald-200">
    D
  </div>

  <div>
    <h1 className="text-xl font-bold text-[#168768]">
      Douvi
    </h1>

    <p className="text-xs text-slate-500">
      Couple Wallet
    </p>
  </div>
</div>

          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features">Tính năng</a>
            <a href="#couple">Ví cặp đôi</a>
            <a href="#pricing">Gói dùng</a>
          </nav>

          <button className="rounded-full bg-[#168768] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0F6F55]">
            Tải app
          </button>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full bg-[#E4F7F0] px-4 py-2 text-sm font-semibold text-[#168768]">
              Ví chat dành cho cá nhân & cặp đôi
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Tiền bạc rõ ràng, tình cảm nhẹ nhàng hơn.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Douvi giúp bạn và người thương ghi thu chi như đang nhắn tin.
              Mỗi giao dịch đều rõ ràng, realtime và dễ hiểu hơn.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-2xl bg-[#168768] px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-200 hover:bg-[#0F6F55]">
                Tải ứng dụng
              </button>

              <button className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-800 hover:bg-slate-50">
                Xem demo
              </button>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="text-xl font-bold text-[#168768]">Realtime</div>
                <div className="mt-1 text-xs text-slate-500">Đồng bộ tức thì</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="text-xl font-bold text-[#168768]">Chat</div>
                <div className="mt-1 text-xs text-slate-500">Ghi tiền dễ hơn</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="text-xl font-bold text-[#168768]">Couple</div>
                <div className="mt-1 text-xs text-slate-500">Dành cho 2 người</div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[2.5rem] bg-slate-950 p-4 shadow-2xl">
              <div className="rounded-[2rem] bg-[#F7FAF8] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Ví cặp đôi</p>
                    <h2 className="text-xl font-bold">Minh & Vợ</h2>
                  </div>
                  <div className="rounded-full bg-[#E4F7F0] px-3 py-1 text-xs font-bold text-[#168768]">
                    Online
                  </div>
                </div>

                <div className="mb-5 rounded-3xl bg-[#168768] p-5 text-white">
                  <p className="text-sm opacity-80">Số dư tháng này</p>
                  <p className="mt-2 text-3xl font-bold">12.450.000đ</p>
                  <p className="mt-2 text-sm opacity-80">Đã tiết kiệm hơn tháng trước 18%</p>
                </div>

                <div className="space-y-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl bg-[#D8F3E9] p-3">
                    <p className="text-sm font-semibold">Anh ăn sáng 69k nha</p>
                    <p className="mt-1 text-xs text-slate-500">Chi tiêu • Ăn uống</p>
                  </div>

                  <div className="max-w-[85%] rounded-2xl bg-white p-3 shadow-sm">
                    <p className="text-sm font-semibold">Em đi chợ 120k nè</p>
                    <p className="mt-1 text-xs text-slate-500">Chi tiêu • Gia đình</p>
                  </div>

                  <div className="ml-auto max-w-[85%] rounded-2xl bg-[#D8F3E9] p-3">
                    <p className="text-sm font-semibold">Anh nhận lương 10tr</p>
                    <p className="mt-1 text-xs text-slate-500">Thu nhập • Lương</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-bold">Gợi ý Douvi</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Tuần này hai bạn đang chi nhiều ở mục ăn uống.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section id="features" className="py-20">
  <div className="mb-10 text-center">
    <p className="font-semibold text-[#168768]">Tính năng nổi bật</p>
    <h2 className="mt-3 text-4xl font-bold text-slate-900">
      Quản lý tiền như đang nhắn tin
    </h2>
  </div>

  <div className="grid gap-5 md:grid-cols-3">
    {[
      ["Chat giao dịch", "Ghi thu chi nhanh như nhắn tin hằng ngày."],
      ["Ví cặp đôi", "Hai người cùng theo dõi tiền bạc realtime."],
      ["Báo cáo thông minh", "Biết tiền đi đâu và điều chỉnh dễ hơn."],
    ].map(([title, desc]) => (
      <div key={title} className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4F7F0] text-xl">
          ✦
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-3 leading-7 text-slate-500">{desc}</p>
      </div>
    ))}
  </div>
</section>
<section id="couple" className="py-20">
  <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
    <div className="grid items-center gap-10 md:grid-cols-2">
      <div>
        <p className="font-semibold text-emerald-300">Dành cho cặp đôi</p>

        <h2 className="mt-3 text-4xl font-bold leading-tight">
          Cùng nhau quản lý tiền, không còn đoán mò.
        </h2>

        <p className="mt-5 leading-8 text-slate-300">
          Douvi giúp hai người ghi nhận thu chi chung, xem báo cáo cùng nhau
          và hiểu rõ thói quen chi tiêu mà không cần hỏi qua hỏi lại.
        </p>
      </div>

      <div className="rounded-3xl bg-white/10 p-5">
        <div className="space-y-3">
          <div className="rounded-2xl bg-white p-4 text-slate-900">
            💬 Anh vừa đổ xăng 50k
          </div>
          <div className="rounded-2xl bg-emerald-400 p-4 font-semibold text-slate-950">
            🛒 Em đi siêu thị 320k
          </div>
          <div className="rounded-2xl bg-white p-4 text-slate-900">
            💰 Lương tháng này về rồi nha
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
        <footer className="mt-12 border-t border-slate-200 py-8 text-center text-sm text-slate-500">
  <p className="font-semibold text-slate-700">
    Douvi - Ví chat cho cá nhân và cặp đôi
  </p>

  <p className="mt-2">
    Theo dõi tiền bạc rõ ràng hơn, cùng nhau sống nhẹ nhàng hơn.
  </p>

  <p className="mt-4">
    © 2026 Douvi. All rights reserved.
  </p>
</footer>
      </section>
    </main>
  );
}