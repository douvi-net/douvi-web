export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-[#168768] mb-6">
          Douvi
        </h1>

        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Ứng dụng ví chat dành cho cá nhân và cặp đôi.
          Theo dõi tiền bạc cùng nhau theo cách hiện đại hơn.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button className="bg-[#168768] hover:bg-[#0F6F55] text-white px-6 py-3 rounded-2xl text-lg font-semibold transition">
            Tải ứng dụng
          </button>

          <button className="bg-white border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-2xl text-lg font-semibold transition">
            Xem demo
          </button>
        </div>
      </div>
    </main>
  );
}