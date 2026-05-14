import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Douvi - Ví chat cho cá nhân và cặp đôi",
  description:
    "Douvi giúp cá nhân và cặp đôi ghi thu chi như đang nhắn tin, đồng bộ realtime và quản lý tiền bạc nhẹ nhàng hơn.",
  keywords: [
    "Douvi",
    "ví cặp đôi",
    "quản lý chi tiêu",
    "app quản lý tiền",
    "ví chat",
    "theo dõi thu chi",
  ],
  openGraph: {
    title: "Douvi - Ví chat cho cá nhân và cặp đôi",
    description:
      "Theo dõi thu chi, quản lý ví cặp đôi và hiểu nhau hơn qua từng giao dịch.",
    url: "https://douvi.net",
    siteName: "Douvi",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Douvi - Ví chat cho cá nhân và cặp đôi",
    description:
      "Ứng dụng ví chat giúp cá nhân và cặp đôi quản lý tiền bạc rõ ràng hơn.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
