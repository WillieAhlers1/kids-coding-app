import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Coding App Adult Portal",
  description: "Parent-guided setup, sharing, and progress portal."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
