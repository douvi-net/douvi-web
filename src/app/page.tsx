const features = [
  {
    title: "Ghi thu chi như nhắn tin",
    desc: "Không cần form phức tạp. Mỗi giao dịch giống một tin nhắn trong cuộc sống hằng ngày.",
  },
  {
    title: "Ví cặp đôi realtime",
    desc: "Hai người cùng thấy giao dịch, số dư và thói quen chi tiêu theo thời gian thực.",
  },
  {
    title: "Báo cáo dễ hiểu",
    desc: "Biết tiền đi đâu, mục nào đang chi nhiều và điều chỉnh nhẹ nhàng hơn.",
  },
];

const transactions = [
  {
    side: "right",
    text: "Anh ăn sáng 69k nha",
    meta: "Chi tiêu • Ăn uống",
  },
  {
    side: "left",
    text: "Em đi chợ 120k nè",
    meta: "Chi tiêu • Gia đình",
  },
  {
    side: "right",
    text: "Anh nhận lương 10tr",
    meta: "Thu nhập • Lương",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F8F7] text-slate-900">
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <div className="absolute left-[-140px] top-[-140px] h-[340px] w-[340px] rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute bottom-[160px] right-[-140px] h-[340px] w-[340px] rounded-full bg-teal-200/50 blur-3xl" />

        <header className="sticky top-4 z-50 flex items-center justify-between rounded-full border border-white/60 bg-white/75 px-5 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#168768] text-lg font-bold text-white shadow-lg shadow-emerald-200">
              D
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#168768]">Douvi</h1>
              <p className="text-xs text-slate-500">Couple Wallet</p>
            </div>
          </div>

          <nav className="hidden gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="hover:text-[#168768]">
              Tính năng
            </a>
            <a href="#couple" className="hover:text-[#168768]">
              Ví cặp đôi
            </a>
            <a href="#pricing" className="hover:text-[#168768]">
              Gói dùng
            </a>
          </nav>

          <a
            href="#download"
            className="rounded-full bg-[#168768] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0F6F55]"
          >
            Tải app
          </a>
        </header>

        <div className="relative grid flex-1 items-center gap-12 py-16 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full bg-[#E4F7F0] px-4 py-2 text-sm font-bold text-[#168768]">
              Ví chat dành cho cá nhân & cặp đôi
            </div>

            <h2 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Tiền bạc rõ ràng, tình cảm nhẹ nhàng hơn.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Douvi giúp bạn và người thương ghi thu chi như đang nhắn tin.
              Mỗi giao dịch đều rõ ràng, realtime và dễ hiểu hơn.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#download"
                className="rounded-2xl bg-[#168768] px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-[#0F6F55]"
              >
                Tải ứng dụng
              </a>

              <a
                href="#features"
                className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center text-base font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Xem tính năng
              </a>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
              {["Realtime", "Chat", "Couple"].map((item) => (
                <div key={item} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="text-xl font-black text-[#168768]">
                    {item}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Chuẩn Douvi
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[2.6rem] bg-slate-950 p-4 shadow-2xl shadow-slate-300">
              <div className="rounded-[2rem] bg-[#F7FAF8] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Ví cặp đôi</p>
                    <h3 className="text-xl font-black">Minh & Vợ</h3>
                  </div>
                  <div className="rounded-full bg-[#E4F7F0] px-3 py-1 text-xs font-bold text-[#168768]">
                    Online
                  </div>
                </div>

                <div className="mb-5 rounded-3xl bg-[#168768] p-5 text-white">
                  <p className="text-sm opacity-80">Số dư tháng này</p>
                  <p className="mt-2 text-3xl font-black">12.450.000đ</p>
                  <p className="mt-2 text-sm opacity-80">
                    Đã tiết kiệm hơn tháng trước 18%
                  </p>
                </div>

                <div className="space-y-3">
                  {transactions.map((item) => (
                    <div
                      key={item.text}
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        item.side === "right"
                          ? "ml-auto bg-[#D8F3E9]"
                          : "bg-white"
                      }`}
                    >
                      <p className="text-sm font-bold">{item.text}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.meta}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-black">Gợi ý Douvi</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Tuần này hai bạn đang chi nhiều ở mục ăn uống.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="features" className="relative py-20">
          <div className="mb-10 text-center">
            <p className="font-bold text-[#168768]">Tính năng nổi bật</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              Quản lý tiền như đang nhắn tin
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-500">
              Douvi biến việc ghi chép tiền bạc thành một trải nghiệm nhẹ nhàng,
              gần gũi và dễ duy trì mỗi ngày.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#E4F7F0] text-2xl">
                  ✦
                </div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="couple" className="py-20">
          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl md:p-12">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="font-bold text-emerald-300">Dành cho cặp đôi</p>

                <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
                  Cùng nhau quản lý tiền, không còn đoán mò.
                </h2>

                <p className="mt-5 leading-8 text-slate-300">
                  Douvi giúp hai người ghi nhận thu chi chung, xem báo cáo cùng
                  nhau và hiểu rõ thói quen chi tiêu mà không cần hỏi qua hỏi
                  lại.
                </p>
              </div>

              <div className="rounded-[2rem] bg-white/10 p-5 backdrop-blur-xl">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white p-4 font-semibold text-slate-900">
                    💬 Anh vừa đổ xăng 50k
                  </div>
                  <div className="rounded-2xl bg-emerald-400 p-4 font-bold text-slate-950">
                    🛒 Em đi siêu thị 320k
                  </div>
                  <div className="rounded-2xl bg-white p-4 font-semibold text-slate-900">
                    💰 Lương tháng này về rồi nha
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="mb-10 text-center">
            <p className="font-bold text-[#168768]">Gói sử dụng</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              Bắt đầu miễn phí, nâng cấp khi cần nhiều hơn
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-500">
              Douvi ưu tiên trải nghiệm đơn giản trước. Bản Premium sẽ mở khóa
              thêm các tính năng nâng cao cho cặp đôi.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <p className="text-lg font-black text-slate-900">Miễn phí</p>
              <p className="mt-3 text-4xl font-black text-[#168768]">0đ</p>
              <p className="mt-3 text-slate-500">
                Phù hợp để bắt đầu quản lý thu chi cá nhân.
              </p>

              <ul className="mt-6 space-y-3 text-slate-600">
                <li>✓ Ví cá nhân</li>
                <li>✓ Ghi thu chi cơ bản</li>
                <li>✓ Báo cáo đơn giản</li>
                <li>✓ Đồng bộ dữ liệu cơ bản</li>
              </ul>
            </div>

            <div className="relative rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
              <div className="absolute right-6 top-6 rounded-full bg-emerald-400 px-4 py-1 text-sm font-black text-slate-950">
                Sắp ra mắt
              </div>

              <p className="text-lg font-black">Douvi Hạnh Phúc</p>
              <p className="mt-3 text-4xl font-black">49.000đ</p>
              <p className="mt-3 text-slate-300">
                Dành cho cặp đôi muốn quản lý tiền bạc cùng nhau.
              </p>

              <ul className="mt-6 space-y-3 text-slate-300">
                <li>✓ Ví cặp đôi realtime</li>
                <li>✓ Ảnh hóa đơn</li>
                <li>✓ Ghim giao dịch quan trọng</li>
                <li>✓ Báo cáo tuần/tháng</li>
                <li>✓ Gợi ý tài chính thông minh</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="download" className="py-20">
          <div className="overflow-hidden rounded-[2.5rem] bg-[#168768] p-10 text-white shadow-xl md:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-bold uppercase tracking-[0.2em] text-emerald-100">
                Douvi App
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Bắt đầu quản lý tiền bạc theo cách hiện đại hơn.
              </h2>

              <p className="mt-6 text-lg leading-8 text-emerald-50">
                Theo dõi thu chi, quản lý ví cặp đôi và trò chuyện về tiền bạc
                dễ dàng hơn bao giờ hết.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="rounded-2xl bg-white px-8 py-4 text-lg font-black text-[#168768] shadow-xl transition hover:bg-slate-100">
                  Tải cho Android
                </button>

                <button className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-black text-white backdrop-blur-xl transition hover:bg-white/20">
                  Sắp có trên iOS
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          <p className="font-bold text-slate-700">
            Douvi - Ví chat cho cá nhân và cặp đôi
          </p>

          <p className="mt-2">
            Theo dõi tiền bạc rõ ràng hơn, cùng nhau sống nhẹ nhàng hơn.
          </p>

          <p className="mt-4">© 2026 Douvi. All rights reserved.</p>
        </footer>
      </section>
    </main>
  );
}