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
    "Douvi là ứng dụng ví chat giúp cá nhân và cặp đôi theo dõi thu chi, quản lý tiền bạc và hiểu nhau hơn qua từng giao dịch.",
  keywords: [
    "Douvi",
    "ví cặp đôi",
    "quản lý chi tiêu",
    "app quản lý tiền",
    "ví chat",
    "theo dõi thu chi",
  ],
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
