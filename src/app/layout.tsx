import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "泡泡白噪音 - 找到内心的平静",
  description: "一个清新现代的白噪音网站，帮助你在心情郁闷烦躁时找到内心的平静。支持多种环境音效的混合播放，创造属于你的宁静空间。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
