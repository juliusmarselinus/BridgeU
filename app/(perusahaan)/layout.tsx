import type { Metadata } from "next";
import { CompanyNavbar } from "@/components/CompanyNavbar";

export const metadata: Metadata = {
  title: "BridgeU Mitra Perusahaan — Kelola & Buka Peluang Kolaborasi",
  description:
    "Portal khusus perusahaan mitra untuk mempublikasikan proyek kolaborasi akademik dan magang.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <CompanyNavbar />
      <div className="pb-16">{children}</div>
    </div>
  );
}
