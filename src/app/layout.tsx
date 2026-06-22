import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogExplainer — AI-powered error analysis",
  description: "Paste a log, get an answer grounded in your team's runbooks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}