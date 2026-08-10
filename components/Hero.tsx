"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Building2,
  Users2,
  FolderCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Code2,
  Palette,
  FlaskConical,
} from "lucide-react";
import { GradientWave } from "@/components/ui/gradient-wave";

const industries = [
  { name: "Teknologi", icon: Code2 },
  { name: "Bisnis", icon: Briefcase },
  { name: "Riset", icon: FlaskConical },
  { name: "Desain", icon: Palette },
  { name: "Startup", icon: Rocket },
  { name: "Pendidikan", icon: GraduationCap },
];

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1">
    <span className="text-xl font-bold text-[#173B6C] sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-[#173B6C]/60 sm:text-xs">
      {label}
    </span>
  </div>
);

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#DCE9F5] text-[#17356F]">
  <GradientWave
    colors={[
      "#DCE9F5",
      "#A9CBEA",
      "#4F91D5",
      "#2475C5",
      "#6FA7D9",
      "#D6E4EF",
    ]}
    className="opacity-95"
    shadowPower={3}
    noiseSpeed={0.000008}
  />

  {/* subtle neutral veil — NOT white */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#EAF0F3]/20 via-transparent to-[#C7D9E8]/25" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-center space-y-7 lg:col-span-7">
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#F1E4D1]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#173B6C]/90 sm:text-xs">
                  Bridging Technology and Students&apos; Needs
                </span>
              </div>
            </div>

            <h1 className="animate-fade-in delay-200 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Menjembatani{" "}
              <span className="bg-gradient-to-br from-white via-white to-[#F1E4D1] bg-clip-text text-transparent">
                mahasiswa
              </span>{" "}
              dan perusahaan lewat kolaborasi akademik.
            </h1>

            <p className="animate-fade-in delay-300 max-w-xl text-base leading-relaxed text-[#173B6C]/75 sm:text-lg">
              Temukan peluang kolaborasi nyata tanpa perlu koneksi pribadi —
              atau kelola permintaan mahasiswa langsung dari satu dasbor
              terpusat.
            </p>

            <div className="animate-fade-in delay-400 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/daftar"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#d8e7f4] px-7 py-3.5 text-sm font-semibold text-[#162660] transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98]"
              >
                Mulai Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#fitur"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-[#173B6C] backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/20"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5 lg:mt-6">
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#5AA5E8]/30 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/35 ring-1 ring-white/25">
                    <Building2 className="h-6 w-6 text-[#173B6C]" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight text-[#173B6C]">
                      Direktori Perusahaan
                    </div>
                    <div className="text-sm text-[#173B6C]/70">
                      Terverifikasi oleh Admin
                    </div>
                  </div>
                </div>

                <div className="mb-8 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#173B6C]/70">Alur Kolaborasi</span>
                    <span className="font-medium text-[#173B6C]">Terstruktur</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/35">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-white to-[#F1E4D1]" />
                  </div>
                </div>

                <div className="mb-6 h-px w-full bg-white/35" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="15" label="Fitur Utama" />
                  <div className="mx-auto h-full w-px bg-white/35" />
                  <StatItem value="3" label="Peran Pengguna" />
                  <div className="mx-auto h-full w-px bg-white/35" />
                  <StatItem value="1" label="Platform Terpusat" />
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-[#173B6C]/90">
                    <FolderCheck className="h-3 w-3 text-[#F1E4D1]" />
                    STUDI KASUS
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-[#173B6C]/90">
                    <Users2 className="h-3 w-3 text-[#173B6C]" />
                    MAGANG
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-[#173B6C]/90">
                    <Building2 className="h-3 w-3 text-[#173B6C]" />
                    RISET
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/15 bg-white/25 py-7 backdrop-blur-xl">
              <h3 className="mb-5 px-7 text-sm font-medium text-[#173B6C]/70">
                Lintas Bidang Industri
              </h3>

              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                }}
              >
                <div className="animate-marquee flex gap-10 whitespace-nowrap px-4">
                  {[...industries, ...industries, ...industries].map(
                    (item, i) => (
                      <div
                        key={i}
                        className="flex cursor-default items-center gap-2 opacity-60 transition-all hover:scale-105 hover:opacity-100"
                      >
                        <item.icon className="h-5 w-5 text-[#173B6C]" />
                        <span className="text-base font-semibold tracking-tight text-[#173B6C]">
                          {item.name}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in delay-500 mt-16 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-white/40 bg-white/5 shadow-xl backdrop-blur-md sm:grid-cols-2">

  <div className="border-b border-white/30 bg-[#F4F7F8]/35 p-8 backdrop-blur-md transition hover:bg-[#F4F7F8]/45 sm:border-b-0 sm:border-r sm:p-10">
    <span className="font-mono text-xs uppercase tracking-widest text-[#216DC0]">
      Untuk Mahasiswa/i
    </span>

    <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#173B6C]">
      Temukan peluang tanpa perlu koneksi
    </h2>

    <p className="mt-3 text-sm leading-relaxed text-[#496783]">
      Ajukan kolaborasi ke perusahaan nyata, bangun portofolio, dan dapat
      rekomendasi berdasarkan skill kamu.
    </p>
            <Link
              href="/daftar?role=mahasiswa"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#A9CBEA] px-6 py-3 text-sm font-semibold text-[#162660] transition-all hover:scale-[1.02] hover:bg-white active:scale-[0.98]"
            >
              Daftar sebagai mahasiswa
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

            <div className="bg-[#E8F1F8]/30 p-8 backdrop-blur-md transition hover:bg-[#E8F1F8]/40 sm:p-10">
             <span className="font-mono text-xs uppercase tracking-widest text-[#216DC0]">
               Untuk Perusahaan
            </span>

            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#173B6C]">
              Kelola kolaborasi dalam satu dasbor
           </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#496783]">
              Publikasikan studi kasus, terima permintaan mahasiswa, dan temukan
              talenta lebih awal.
            </p>
            <Link
              href="/daftar?role=perusahaan"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-[#173B6C] backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/20 active:scale-[0.98]"
            >
              Daftar sebagai perusahaan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #D0E6FD)",
        }}
      />
    </section>
  );
}
