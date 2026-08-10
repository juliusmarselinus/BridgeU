import type { Metadata } from "next";
import { AdminNavbar } from "@/components/AdminNavbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BridgeU Admin Control Center — Moderasi & Verifikasi Platform",
  description:
    "Portal administrator BridgeU untuk memantau peluang kolaborasi, verifikasi perusahaan, dan manajemen pengguna.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col justify-between">
      <AdminNavbar />
      <div className="pb-16 flex-1">{children}</div>
      <Footer />
    </div>
  );
}
