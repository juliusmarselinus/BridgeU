"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BridgeDivider } from "@/components/BridgeDivider";
import { AuthModal } from "@/components/AuthModal";
import { ProgramsSection } from "@/components/ProgramsSection";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { HeroScrollSection } from "@/components/HeroScrollSection";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";


const features = [
  {
    label: "01",
    title: "Perusahaan Terverifikasi",
    desc: "Jelajahi daftar perusahaan yang sudah diverifikasi untuk kolaborasi akademik.",
  },
  {
    label: "02",
    title: "Peluang Kolaborasi",
    desc: "Cari studi kasus, riset, atau magang yang cocok dengan minat dan skill kamu.",
  },
  {
    label: "03",
    title: "Portfolio Otomatis",
    desc: "Setiap kolaborasi yang selesai otomatis jadi rekam jejak prestasimu.",
  },
];

const navItems = [
  { name: "Fitur", link: "#fitur" },
  { name: "Cara Kerja", link: "#cara-kerja" },
];

export default function LandingPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"masuk" | "daftar">("masuk");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openModal = (tab: "masuk" | "daftar") => {
    if (tab === "daftar") {
      router.push("/daftar");
      return;
    }
    setModalTab(tab);
    setModalOpen(true);
  };

  return (
    <main>
      {/* NAVBAR — animated resize on scroll */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton as="button" variant="secondary" onClick={() => openModal("masuk")}>
              Masuk
            </NavbarButton>
            <NavbarButton as={Link} href="/daftar" variant="primary">
              Daftar
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((p) => !p)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                onClick={() => setMobileMenuOpen(false)}
                className="relative text-text-secondary"
              >
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-3">
              <NavbarButton
                as="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal("masuk");
                }}
              >
                Masuk
              </NavbarButton>
              <NavbarButton
                as={Link}
                href="/daftar"
                variant="primary"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* HERO */}
      <Hero />

      <HeroScrollSection />

      <div className="mx-auto max-w-6xl px-6">
        <BridgeDivider />
      </div>

      {/* FITUR */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Kenapa BridgeU?
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.label} className="rounded-xl p-1 transition hover:-translate-y-1">
              <span className="font-mono text-xs text-bridge-gold">{f.label}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <ProgramsSection />

      {/* FOOTER */}
      <Footer />

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={modalTab}
      />
    </main>
  );
}