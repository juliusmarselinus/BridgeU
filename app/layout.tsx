import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BridgeU — Bridging Technology and Students' Needs",
  description:
    "Platform penghubung mahasiswa dan perusahaan untuk kolaborasi akademik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-body bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}