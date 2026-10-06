import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Adrian Rodriguez · Web & Mobile Developer",
  description:
    "Portfolio of Adrian Rodriguez, web and mobile app developer based in Madrid. React, TypeScript, React Native and Node.js.",
  icons: { icon: "/icons/favicon.webp" },
  openGraph: {
    title: "Adrian Rodriguez · Web & Mobile Developer",
    description: "Designing and building web and mobile applications.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
