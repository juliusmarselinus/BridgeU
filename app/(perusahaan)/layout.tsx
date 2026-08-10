import type { Metadata } from "next";
import { CompanyNavbar } from "@/components/CompanyNavbar";
import { Footer } from "@/components/Footer";

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
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col justify-between">
      <CompanyNavbar />
      <div className="pb-16 flex-1">{children}</div>
      <Footer />
    </div>
  );
}
