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
    <div className="relative min-h-screen text-ink antialiased flex flex-col justify-between overflow-hidden">
      {/* Background light-blue animated (GradientWave, sama komponen yang dipakai di /masuk & /daftar) — identitas visual khusus Perusahaan */}
      <GradientWave
        colors={["#F2F7FB", "#E6F0F8", "#D6E7F3", "#C3DAEC", "#ADC9E2", "#97B8D8"]}
        className="opacity-100"
        shadowPower={3}
        noiseSpeed={0.000008}
      />

      <div className="relative z-10 flex flex-col justify-between flex-1">
        <CompanyNavbar />
        <div className="pb-16 flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
