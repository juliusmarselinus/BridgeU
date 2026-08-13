import type { Metadata } from "next";
import { CompanyNavbar } from "@/components/CompanyNavbar";
import { Footer } from "@/components/Footer";
import { GradientWave } from "@/components/ui/gradient-wave";

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
    <div className="relative min-h-screen text-ink antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Background light-blue animated */}
      <GradientWave
        colors={["#F2F7FB", "#E6F0F8", "#D6E7F3", "#C3DAEC", "#ADC9E2", "#97B8D8"]}
        className="opacity-100"
        shadowPower={3}
        noiseSpeed={0.000008}
      />

      <div className="relative z-10 flex flex-col justify-between flex-1 min-h-screen">
        {/* CompanyNavbar dibuat melayang di paling atas layar (Absolute Floating) */}
        <div className="absolute top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-8">
          <CompanyNavbar />
        </div>

        {/* Children sekarang mentok ke paling atas halaman tanpa terdorong Navbar */}
        <main className="pb-16 flex-1 w-full pt-0">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}