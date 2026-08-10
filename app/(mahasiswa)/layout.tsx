import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

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
    <div className="relative min-h-screen bg-paper text-ink antialiased">
      {/* Sticky floating Navbar at the top of the viewport */}
      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      {/* Pull page content up to top-0 so page top background extends behind Navbar seamlessly */}
      <div className="-mt-[76px] pb-16">{children}</div>
    </div>
  );
}
