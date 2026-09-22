import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { SITE_URL } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Warikan — リアルタイム割り勘",
  description:
    "URLを共有するだけで、ログイン不要のリアルタイム割り勘。メンバー傾斜・立替・最小送金まで一気に。",
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${outfit.variable} ${fraunces.variable} antialiased`}>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
