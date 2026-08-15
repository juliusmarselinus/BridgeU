"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
function IconBuilding({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01" />
    </svg>
  );
}
function IconMail({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function IconPin({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.5-6h1.5V5H3v6h1.5L5 17z" />
    </svg>
  );
}
function IconCheck({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconGlobe({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconUsers({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconCalendar({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconBriefcase({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IconFileText({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconRocket({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5l-3-3c-1 0-1.79.79-1.5 2.5z" />
      <path d="M12 15l-3-3 8.5-8.5c1.2-1.2 3.1-1.2 4.3 0s1.2 3.1 0 4.3L12 15z" />
      <path d="M9 18l3 3" />
    </svg>
  );
}
function IconInfo({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal helpers (sama kayak public profile mahasiswa)                */
/* ------------------------------------------------------------------ */
function RevealCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealText({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function PhotoLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-6 cursor-zoom-out"
    >
      <motion.img
        layoutId="public-company-avatar-photo"
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="h-[70vmin] w-[70vmin] max-h-[80vh] max-w-[90vw] rounded-full object-cover shadow-2xl cursor-default border-4 border-paper"
      />
    </motion.div>
  );
}

function InfoField({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div
      className="group rounded-xl p-3.5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "#EAF2FB",
        boxShadow: "5px 5px 12px rgba(23,59,108,0.12), -5px -5px 12px rgba(255,255,255,0.9)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && (
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-ocean"
            style={{ boxShadow: "inset 2px 2px 5px rgba(23,59,108,0.15), inset -2px -2px 5px rgba(255,255,255,0.8)" }}
          >
            <Icon className="w-3 h-3 text-ocean" />
          </span>
        )}
        <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase">{label}</p>
      </div>
      <p className="text-sm font-semibold text-ink/90">{value || "—"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */
const TABS = [
  { key: "profile", label: "Profil Perusahaan", icon: IconBuilding },
  { key: "kolaborasi", label: "Kolaborasi Publik", icon: IconRocket },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const tabSlideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

/* ------------------------------------------------------------------ */
/* Main Public Company Profile Page for Mahasiswa                      */
/* ------------------------------------------------------------------ */
export default function MahasiswaCompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.id;

  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [tabDirection, setTabDirection] = useState(1);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    async function fetchProfile() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const { data: authData } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (authData.session?.access_token) {
          headers.Authorization = `Bearer ${authData.session.access_token}`;
        }
        const res = await fetch(`/api/profile/company/${companyId}`, {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (isMounted) setErrorMsg(body.error || "Profil perusahaan tidak ditemukan");
        } else {
          const data = await res.json();
          if (isMounted) setProfileData(data);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (isMounted) {
          if (err.name === "AbortError") {
            setErrorMsg("Koneksi Waktu Habis. Gagal menghubungkan ke server.");
          } else {
            setErrorMsg(err.message || "Gagal memuat profil perusahaan");
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [companyId]);

  const publicCompany = useMemo(() => {
    if (!profileData) return null;
    return {
      id: profileData.id,
      nama: profileData.nama_perusahaan || "Perusahaan Terdaftar",
      email: profileData.email || "",
      logo: profileData.logo_url || "",
      sektor: profileData.nama_sektor || "-",
      kota: profileData.nama_kota || "-",
      nib: profileData.nib || "-",
      ukuran: profileData.ukuran_perusahaan
        ? profileData.ukuran_perusahaan.toLowerCase().includes("karyawan")
          ? profileData.ukuran_perusahaan
          : `${profileData.ukuran_perusahaan} karyawan`
        : "-",
      status: profileData.status_verifikasi || "Terverifikasi",
      tahunBerdiri: profileData.tahun_berdiri || "-",
      situsWeb: profileData.situs_web || "",
      alamat: profileData.alamat_lengkap || "-",
      deskripsi: profileData.deskripsi_perusahaan || "",
      kolaborasi: Array.isArray(profileData.kolaborasi) ? profileData.kolaborasi : [],
    };
  }, [profileData]);

  const handleTabChange = (key: TabKey) => {
    const oldIndex = TABS.findIndex((t) => t.key === activeTab);
    const newIndex = TABS.findIndex((t) => t.key === key);
    setTabDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(key);
  };

  const initials = (publicCompany?.nama || "PT")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-clouds flex items-center justify-center">
        <p className="text-xs font-mono text-steel">Memuat profil perusahaan...</p>
      </main>
    );
  }

  if (errorMsg || !publicCompany) {
    return (
      <main className="min-h-screen bg-clouds flex flex-col items-center justify-center p-6 text-center pt-24">
        <div className="max-w-md w-full rounded-3xl border border-rose-200 bg-card p-8 shadow-xl flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-ink">Gagal Memuat Profil</h2>
          <p className="mt-2 text-xs font-mono text-steel leading-relaxed">{errorMsg || "Profil perusahaan tidak ditemukan"}</p>
          <div className="mt-6 flex gap-3 w-full">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 rounded-xl bg-ink py-2.5 text-xs font-bold text-paper shadow-md transition hover:bg-ink/90"
            >
              Coba Lagi
            </button>
            <Link
              href="/dashboard"
              className="flex-1 rounded-xl border border-border bg-surface py-2.5 text-xs font-bold text-steel transition hover:text-ink text-center"
            >
              Ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-clouds text-ink pb-20 overflow-x-visible">
      <AnimatePresence>
        {isPhotoOpen && publicCompany.logo && (
          <PhotoLightbox src={publicCompany.logo} alt={publicCompany.nama} onClose={() => setIsPhotoOpen(false)} />
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="w-full bg-clouds">
        <div
          className="w-full relative pt-28 pb-24 sm:pb-28 rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)] overflow-hidden"
          style={{ background: "linear-gradient(160deg, #12284B 0%, #1B3A63 45%, #8CC1E9 100%)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 relative overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-10 sm:-mt-12 gap-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-20">
              <div className="relative group shrink-0 pt-3">
                <div
                  onClick={() => publicCompany.logo && setIsPhotoOpen(true)}
                  className={`h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full transition-all duration-300 border-[6px] border-paper bg-card shadow-xl group-hover:scale-105 ${
                    publicCompany.logo ? "cursor-zoom-in" : ""
                  }`}
                >
                  <div className="h-full w-full overflow-hidden rounded-full bg-[#CBE0F1] flex items-center justify-center">
                    {publicCompany.logo ? (
                      <motion.img
                        layoutId="public-company-avatar-photo"
                        src={publicCompany.logo}
                        alt={publicCompany.nama}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-display text-4xl sm:text-5xl font-bold text-[#0D2B4A]">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                  <RevealText>{publicCompany.nama}</RevealText>
                </h2>
                <p className="text-xs sm:text-sm font-medium text-steel mt-0.5">
                  {[publicCompany.sektor, publicCompany.kota].filter((v) => v && v !== "-").join(" • ")}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="rounded-lg bg-sky/15 px-2.5 py-1 text-xs font-bold text-ink border border-sky/40 flex items-center gap-1.5">
                    <IconBriefcase className="w-3.5 h-3.5 text-ocean" />
                    NIB {publicCompany.nib}
                  </span>
                  <span className="rounded-lg bg-paper px-2.5 py-1 text-xs font-semibold text-ink/80 border border-steel/20">
                    {publicCompany.ukuran}
                  </span>
                  <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                    <IconCheck className="w-3.5 h-3.5" />
                    {publicCompany.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="flex justify-start overflow-x-auto pt-3 pb-3">
            <div className="flex gap-2 sm:gap-3 border-b border-transparent">
              {TABS.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`relative isolate flex items-center gap-2.5 rounded-full px-5 py-3 sm:px-6 text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
                      isActive ? "text-paper shadow-md" : "bg-card text-steel shadow-sm hover:text-ink hover:shadow-md"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-company-tab-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-ink shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <IconComp className={`w-4 h-4 ${isActive ? "text-sky" : "text-steel"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-8 lg:px-12 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <RevealCard delay={0} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconFileText className="w-4 h-4 text-ink/60" />
                Tentang Perusahaan
              </h3>
              <p className="text-xs leading-relaxed text-steel">
                {publicCompany.deskripsi || "Belum ada deskripsi perusahaan yang ditambahkan."}
              </p>
            </RevealCard>

            <RevealCard delay={0.03} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                <IconPin className="w-4 h-4 text-ink/60" />
                Informasi Umum
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <InfoField label="Sektor" value={publicCompany.sektor} icon={IconBriefcase} />
                <InfoField label="Kota" value={publicCompany.kota} icon={IconPin} />
                <InfoField label="Ukuran" value={publicCompany.ukuran} icon={IconUsers} />
                <InfoField label="Tahun Berdiri" value={publicCompany.tahunBerdiri} icon={IconCalendar} />
              </div>
            </RevealCard>

            <RevealCard delay={0.06} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconMail className="w-4 h-4 text-ink/60" />
                Kontak
              </h3>
              <div className="space-y-2.5">
                {publicCompany.email && (
                  <a
                    href={`mailto:${publicCompany.email}`}
                    className="flex items-center gap-2 text-xs font-semibold text-ocean hover:underline"
                  >
                    <IconMail className="w-3.5 h-3.5" />
                    {publicCompany.email}
                  </a>
                )}
                {publicCompany.situsWeb && (
                  <a
                    href={publicCompany.situsWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-ocean hover:underline"
                  >
                    <IconGlobe className="w-3.5 h-3.5" />
                    {publicCompany.situsWeb}
                  </a>
                )}
                {!publicCompany.email && !publicCompany.situsWeb && (
                  <p className="text-xs text-steel/70">Belum ada informasi kontak.</p>
                )}
              </div>
            </RevealCard>
          </div>

          {/* Right Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={tabDirection}>
                <motion.div
                  key={activeTab}
                  custom={tabDirection}
                  variants={tabSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* TAB 1: PROFIL PERUSAHAAN */}
                  {activeTab === "profile" && (
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                      <h3 className="text-base font-bold text-ink border-b border-steel/10 pb-4 mb-6 flex items-center gap-2">
                        <IconInfo className="w-4 h-4 text-ink/60" />
                        Informasi Perusahaan Lengkap
                      </h3>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          <InfoField label="Nama Perusahaan" value={publicCompany.nama} icon={IconBuilding} />
                          <InfoField label="NIB" value={publicCompany.nib} icon={IconFileText} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t border-steel/10 pt-5">
                          <InfoField label="Sektor" value={publicCompany.sektor} icon={IconBriefcase} />
                          <InfoField label="Kota" value={publicCompany.kota} icon={IconPin} />
                          <InfoField label="Tahun Berdiri" value={publicCompany.tahunBerdiri} icon={IconCalendar} />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 border-t border-steel/10 pt-5">
                          <InfoField label="Ukuran Perusahaan" value={publicCompany.ukuran} icon={IconUsers} />
                          <InfoField label="Status Verifikasi" value={publicCompany.status} icon={IconCheck} />
                        </div>

                        <div className="border-t border-steel/10 pt-5">
                          <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase flex items-center gap-1.5 mb-2.5">
                            <IconPin className="w-3.5 h-3.5 text-ink/60" />
                            Alamat Lengkap
                          </p>
                          <p className="text-sm font-semibold text-ink/90">{publicCompany.alamat}</p>
                        </div>

                        <div className="border-t border-steel/10 pt-5">
                          <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase flex items-center gap-1.5 mb-2.5">
                            <IconFileText className="w-3.5 h-3.5 text-ink/60" />
                            Deskripsi Perusahaan
                          </p>
                          <p className="text-xs leading-relaxed text-steel">
                            {publicCompany.deskripsi || "Belum ada deskripsi yang ditambahkan."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: KOLABORASI PUBLIK */}
                  {activeTab === "kolaborasi" && (
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                      <h3 className="text-base font-bold text-ink border-b border-steel/10 pb-4 mb-6 flex items-center gap-2">
                        <IconRocket className="w-4 h-4 text-ink/60" />
                        Riwayat Kolaborasi Publik
                      </h3>

                      {publicCompany.kolaborasi.length > 0 ? (
                        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-steel/20">
                          {publicCompany.kolaborasi.map((k: any, idx: number) => (
                            <motion.div
                              key={k.id || idx}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.04, ease: "easeOut" }}
                              className="relative group"
                            >
                              <span className="absolute -left-[19px] top-1.5 h-3 w-3 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20 group-hover:scale-125 transition-transform" />
                              <div className="rounded-xl border border-border bg-card p-4 hover:border-steel/40 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <h4 className="text-sm font-bold text-ink">{k.judul || "Proyek Kolaborasi"}</h4>
                                  <span className="text-[11px] font-medium text-steel/70 shrink-0">{k.tanggal || "Terbaru"}</span>
                                </div>
                                <p className="mt-2 text-xs text-steel leading-relaxed">
                                  {k.deskripsi || `Status: ${k.status || "Berlangsung"}`}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-steel/70">Belum ada riwayat kolaborasi publik yang tercatat.</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
