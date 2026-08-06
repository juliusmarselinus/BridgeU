"use client";

import { useState } from "react";
import { BridgeDivider } from "@/components/BridgeDivider";
import { AuthModal } from "@/components/AuthModal";

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

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"masuk" | "daftar">("masuk");

  const openModal = (tab: "masuk" | "daftar") => {
    setModalTab(tab);
    setModalOpen(true);
  };

  return (
    <main>
      {/* NAVBAR — sticky + blur */}
      <nav className="sticky top-0 z-40 border-b border-steel/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-xl font-semibold tracking-tight">
            Bridge<span className="text-bridge-gold">U</span>
          </span>

          <div className="hidden gap-8 font-mono text-xs uppercase tracking-wide text-steel sm:flex">
            <a href="#fitur" className="transition hover:text-ink">
              Fitur
            </a>
            <a href="#cara-kerja" className="transition hover:text-ink">
              Cara Kerja
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => openModal("masuk")}
              className="text-steel transition hover:text-ink"
            >
              Masuk
            </button>
            <button
              onClick={() => openModal("daftar")}
              className="rounded-full bg-ink px-5 py-2.5 text-paper shadow-sm transition hover:scale-[1.03] hover:bg-steel"
            >
              Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-bridge-gold">
          Bridging Technology and Students&apos; Needs
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Menjembatani mahasiswa dan perusahaan lewat kolaborasi akademik.
        </h1>
        <p className="mt-5 max-w-xl text-base text-steel">
          Temukan peluang kolaborasi nyata tanpa perlu koneksi pribadi — atau
          kelola permintaan mahasiswa langsung dari satu dasbor terpusat.
        </p>

        <button
          onClick={() => openModal("daftar")}
          className="mt-8 rounded-full bg-bridge-gold px-7 py-3.5 text-sm font-medium text-ink shadow-sm transition hover:scale-[1.03] hover:shadow-md"
        >
          Mulai Sekarang →
        </button>

        <div className="mt-14 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-steel/15 shadow-sm sm:grid-cols-2">
          <div className="bg-ink p-8 text-paper transition sm:p-10">
            <span className="font-mono text-xs uppercase tracking-widest text-bridge-gold">
              Untuk Mahasiswa/i
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold">
              Temukan peluang tanpa perlu koneksi
            </h2>
            <p className="mt-3 text-sm text-paper/70">
              Ajukan kolaborasi ke perusahaan nyata, bangun portofolio, dan
              dapat rekomendasi berdasarkan skill kamu.
            </p>
            <button
              onClick={() => openModal("daftar")}
              className="mt-6 font-mono text-sm text-bridge-gold underline underline-offset-4 transition hover:text-paper"
            >
              Daftar sebagai mahasiswa →
            </button>
          </div>

          <div className="bg-paper p-8 transition sm:p-10">
            <span className="font-mono text-xs uppercase tracking-widest text-steel">
              Untuk Perusahaan
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
              Kelola kolaborasi dalam satu dasbor
            </h2>
            <p className="mt-3 text-sm text-steel">
              Publikasikan studi kasus, terima permintaan mahasiswa, dan
              temukan talenta lebih awal.
            </p>
            <button
              onClick={() => openModal("daftar")}
              className="mt-6 font-mono text-sm text-ink underline underline-offset-4 transition hover:text-bridge-gold"
            >
              Daftar sebagai perusahaan →
            </button>
          </div>
        </div>
      </section>

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
            <div
              key={f.label}
              className="rounded-xl p-1 transition hover:-translate-y-1"
            >
              <span className="font-mono text-xs text-bridge-gold">
                {f.label}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-steel">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-steel/15 px-6 py-8">
        <p className="mx-auto max-w-6xl font-mono text-xs text-steel">
          BridgeU — INSPIRE 2026 · Lotus Biru
        </p>
      </footer>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={modalTab}
      />
    </main>
  );
}