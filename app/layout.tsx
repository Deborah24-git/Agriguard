import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "AgriGuard monitors water flow, pressure and valve state across crop irrigation and livestock watering points, alerting farmers to suspected leaks, blockages and pressure drops.";

export const metadata: Metadata = {
  title: {
    default: "AgriGuard — Farm Water Monitoring",
    template: "%s | AgriGuard",
  },
  description,
  openGraph: {
    title: "AgriGuard — Farm Water Monitoring",
    description,
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('agriguard-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
