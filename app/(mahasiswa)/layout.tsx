import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "BridgeU — Portal Mahasiswa",
  description:
    "Platform penghubung mahasiswa dan perusahaan untuk kolaborasi akademik, magang, dan ekspansi portofolio.",
};

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-clouds text-ink antialiased flex flex-col justify-between">
      {/* Fixed floating glass navbar — detached from flow, floats over page content */}
      <Navbar />

      <div className="flex-1">{children}</div>

      <Footer />
    </div>
  );
}
