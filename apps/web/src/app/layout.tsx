import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Stellar Circles",
    template: "%s | Stellar Circles",
  },
  description:
    "Micro-societies built on earned social capital. Form circles around learning, business, fitness, and farming — where influence is earned, not bought.",
  keywords: ["social coordination", "stellar", "micro-communities", "circles", "social capital"],
  openGraph: {
    title: "Stellar Circles",
    description: "Earn influence through participation. Not tokens.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
