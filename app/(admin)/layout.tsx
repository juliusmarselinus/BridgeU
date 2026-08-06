import type { Metadata } from "next";
import { AdminNavbar } from "@/components/AdminNavbar";

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
    <div className="min-h-screen bg-paper text-ink antialiased">
      <AdminNavbar />
      <div className="pb-16">{children}</div>
    </div>
  );
}
