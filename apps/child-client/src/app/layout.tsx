import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Coding App",
  description: "Family-first coding adventures for young kids."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
