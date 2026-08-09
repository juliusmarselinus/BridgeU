"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { getUserProfileById, badgeList, dummyPelamarList } from "@/lib/dummy-data";

/* ------------------------------------------------------------------ */
/* SVG Icon Components                                                */
/* ------------------------------------------------------------------ */

function IconCheck({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconTrophy({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  );
}

function IconRocket({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5l-3-3c-1 0-1.79.79-1.5 2.5z" />
      <path d="M12 15l-3-3 8.5-8.5c1.2-1.2 3.1-1.2 4.3 0s1.2 3.1 0 4.3L12 15z" />
      <path d="M9 18l3 3" />
    </svg>
  );
}

function IconActivity({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconFileText({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconPin({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.5-6h1.5V5H3v6h1.5L5 17z" />
    </svg>
  );
}

function IconClipboard({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconTarget({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconWrench({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconLock({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconFlame({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
      <path d="M12 2c1.72 2.76 4.5 4.2 4.5 8.5a6.5 6.5 0 1 1-13 0c0-4.3 2.78-5.74 4.5-8.5 1.25 2.5 2.75 3.5 4 0z" />
    </svg>
  );
}

function IconCheckSquare({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconSparkles({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Animated number that follows a spring instead of a linear interval  */
/* ------------------------------------------------------------------ */
function useSpringNumber(target: number, springConfig = { stiffness: 120, damping: 18 }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, springConfig);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionVal.set(target);
  }, [target, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return display;
}

/* ------------------------------------------------------------------ */
/* Subtle cursor-follow ambient glow (contained to its parent)         */
/* ------------------------------------------------------------------ */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background: useTransform(
          [springX, springY],
          ([lx, ly]: number[]) =>
            `radial-gradient(220px circle at ${lx}px ${ly}px, rgba(212,175,55,0.08), transparent 70%)`
        ),
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Entrance wrapper — consistent fade + slide-up used across cards     */
/* ------------------------------------------------------------------ */
function RevealCard({
  children,
  delay = 0,
  className = "",
  nudgeKey,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  nudgeKey?: string | number;
}) {
  return (
    <motion.div
      key={nudgeKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Text reveal — clip-path sweep, used for name / section titles      */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Photo Lightbox — click avatar to zoom to center (shared layoutId)  */
/* ------------------------------------------------------------------ */
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
        layoutId="public-profile-avatar-photo"
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="h-[70vmin] w-[70vmin] max-h-[80vh] max-w-[90vw] rounded-full object-cover shadow-2xl cursor-default border-4 border-paper"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Minimal Border-based Level Gamification Progress Bar Component      */
/* ------------------------------------------------------------------ */
function LevelGamificationCard({ level, totalPengajuan }: { level: number; totalPengajuan: number }) {
  const animatedLevel = useSpringNumber(level);

  const xpCurrent = totalPengajuan % 2;
  const xpNext = 2;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNext) * 100));
  const xpRemaining = xpNext - xpCurrent;

  let levelTitle = "Novice Explorer";
  if (level === 2) levelTitle = "Active Collaborator";
  if (level === 3) levelTitle = "Project Master";
  if (level >= 4) levelTitle = "Elite Architect";

  return (
    <div className="relative group cursor-default overflow-visible z-30 w-full">
      <div className="relative overflow-hidden w-full rounded-2xl border border-steel/20 bg-paper p-5 transition-colors duration-200 hover:border-bridge-gold/60">
        <CursorGlow />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-bridge-gold/40 bg-bridge-gold/10 text-bridge-gold">
              <IconTrophy className="w-6 h-6 text-bridge-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-ink">
                  Level {animatedLevel}
                </span>
                <span className="rounded-lg border border-bridge-gold/40 bg-bridge-gold/10 px-2.5 py-0.5 text-xs font-bold text-ink">
                  {levelTitle}
                </span>
              </div>
              <p className="text-xs text-steel font-medium mt-0.5">
                {xpRemaining > 0
                  ? `Butuh ${xpRemaining} pengajuan proyek lagi untuk naik level berikutnya`
                  : "Siap naik ke level berikutnya!"}
              </p>
            </div>
          </div>

          <div className="w-full md:w-72 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold text-ink/80 mb-1.5">
              <span>Progres Gamifikasi</span>
              <span className="text-bridge-gold font-mono">{xpCurrent}/{xpNext} XP ({xpPercent}%)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-steel/10 overflow-hidden border border-steel/20">
              <motion.div
                className="h-full bg-bridge-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 16 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper Component                                                   */
/* ------------------------------------------------------------------ */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-xl p-2.5 transition duration-150 hover:bg-paper">
      <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink/90">{value || "—"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public Activity Section Component                                   */
/* ------------------------------------------------------------------ */
function PublicActivitySection({ nama }: { nama: string }) {
  const [filter, setFilter] = useState<"semua" | "kolaborasi" | "skill" | "pencapaian">("semua");

  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayNum = d.getDate();
      const count = (dayNum % 7 === 0 || dayNum % 5 === 0) ? Math.floor((dayNum % 4) + 1) : (dayNum % 3 === 0 ? 1 : 0);
      days.push({
        date: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        count,
      });
    }
    return days;
  }, []);

  const statCards = [
    { label: "Total Kontribusi", value: 38, suffix: "", extra: "+12%", desc: "Aksi publik dalam 30 hari", icon: IconActivity },
    { label: "Streak Keaktifan", value: 14, suffix: " Hari", extra: "", desc: "Aktif berturut-turut", icon: IconFlame },
    { label: "Reputasi Publik", value: 480, suffix: " Pts", extra: "", desc: "Top 5% Mahasiswa Aktif", icon: IconTrophy },
    { label: "Respon Rate", value: 98, suffix: "%", extra: "", desc: "Respon komunikasi cepat", icon: IconCheckSquare },
  ];

  const rawActivities = [
    {
      id: "act-1",
      kategori: "kolaborasi",
      judul: "Pengajuan Lamaran Proyek",
      deskripsi: `${nama} mengajukan kolaborasi Studi Kasus: Optimasi UX Aplikasi Perbankan di Nexora Digital.`,
      waktu: "Hari ini, 14:30",
      badgeText: "Kolaborasi",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-2",
      kategori: "skill",
      judul: "Pembaruan Skill & Portofolio",
      deskripsi: "Menambahkan skill baru ke profil publik.",
      waktu: "Kemarin, 09:15",
      badgeText: "Skill & Tools",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-3",
      kategori: "pencapaian",
      judul: "Membuka Badge Baru",
      deskripsi: "Berhasil mendapatkan badge baru dari keaktifan kolaborasi.",
      waktu: "3 Hari lalu",
      badgeText: "Pencapaian",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-4",
      kategori: "kolaborasi",
      judul: "Disetujui untuk Magang",
      deskripsi: "Lamaran magang telah dikonfirmasi dan disetujui.",
      waktu: "5 Hari lalu",
      badgeText: "Kolaborasi",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-5",
      kategori: "skill",
      judul: "Memperbarui Preferensi Kerja",
      deskripsi: "Mengubah preferensi sistem kerja.",
      waktu: "1 Minggu lalu",
      badgeText: "Profil Update",
      badgeColor: "bg-steel/10 text-ink/80 border-steel/20",
    },
  ];

  const filteredActivities = useMemo(() => {
    if (filter === "semua") return rawActivities;
    return rawActivities.filter((a) => a.kategori === filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const StatIcon = stat.icon;
          const animatedValue = useSpringNumber(stat.value);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-steel/20 bg-paper p-4.5 hover:border-bridge-gold/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-steel">{stat.label}</span>
                <div className="p-2 rounded-xl bg-bridge-gold/10 text-bridge-gold border border-bridge-gold/30">
                  <StatIcon className="w-4 h-4 text-bridge-gold" />
                </div>
              </div>
              <p className="text-2xl font-black text-ink mt-2">
                {animatedValue}
                {stat.suffix}{" "}
                {stat.extra && <span className="text-xs font-semibold text-bridge-gold">{stat.extra}</span>}
              </p>
              <p className="text-[11px] text-steel/70 mt-1">{stat.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-steel/20 bg-paper p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel/10 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <IconActivity className="w-5 h-5 text-bridge-gold" />
              Matriks Keaktifan Publik
            </h3>
            <p className="text-xs text-steel mt-0.5">Catatan aktivitas selama 12 minggu terakhir</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-steel/70">
            <span>Kurang</span>
            <span className="h-3 w-3 rounded-xs bg-steel/10 inline-block" />
            <span className="h-3 w-3 rounded-xs bg-bridge-gold/25 inline-block" />
            <span className="h-3 w-3 rounded-xs bg-bridge-gold inline-block" />
            <span className="h-3 w-3 rounded-xs bg-bridge-gold/100 inline-block" />
            <span>Banyak</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[640px]">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5">
              {heatmapDays.map((item, idx) => {
                let colorClass = "bg-steel/10 hover:bg-steel/20";
                if (item.count === 1) colorClass = "bg-bridge-gold/25 hover:bg-bridge-gold/50";
                if (item.count === 2) colorClass = "bg-bridge-gold hover:bg-bridge-gold/100";
                if (item.count >= 3) colorClass = "bg-bridge-gold/100 hover:bg-bridge-gold";

                return (
                  <div
                    key={idx}
                    title={`${item.date}: ${item.count} kontribusi`}
                    className={`h-3.5 w-3.5 rounded-sm transition-all duration-150 hover:scale-125 cursor-pointer ${colorClass}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-steel/20 bg-paper p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/10 pb-4 mb-6">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <IconRocket className="w-5 h-5 text-bridge-gold" />
            Riwayat Aktivitas Publik
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "semua", label: "Semua" },
              { key: "kolaborasi", label: "Kolaborasi" },
              { key: "skill", label: "Skill & Profil" },
              { key: "pencapaian", label: "Pencapaian" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                  filter === t.key
                    ? "bg-ink text-paper"
                    : "border border-steel/20 bg-paper text-steel hover:bg-paper"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-steel/20">
          {filteredActivities.map((act, idx) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04, ease: "easeOut" }}
              className="relative group"
            >
              <span className="absolute -left-[19px] top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-bridge-gold ring-2 ring-bridge-gold/20 group-hover:scale-125 transition-transform" />
              <div className="rounded-xl border border-steel/20 bg-paper p-4 hover:border-steel/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${act.badgeColor}`}>
                      {act.badgeText}
                    </span>
                    <h4 className="text-sm font-bold text-ink">{act.judul}</h4>
                  </div>
                  <span className="text-[11px] font-medium text-steel/70 shrink-0">{act.waktu}</span>
                </div>
                <p className="mt-2 text-xs text-steel leading-relaxed">{act.deskripsi}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab config (order matters — used to derive slide direction)         */
/* ------------------------------------------------------------------ */
const TABS = [
  { key: "profile", label: "Detail Profil", icon: IconUser },
  { key: "activity", label: "Aktivitas Publik", icon: IconActivity },
  { key: "pencapaian", label: "Pencapaian", icon: IconTrophy },
  { key: "pengajuan", label: "Status Kolaborasi", icon: IconRocket },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const tabSlideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

/* ------------------------------------------------------------------ */
/* Main Public Profile Page Component                                  */
/* ------------------------------------------------------------------ */
export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const profileId = resolvedParams.id.toLowerCase();

  const publicUser = getUserProfileById(profileId);

  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [tabDirection, setTabDirection] = useState(1);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const handleTabChange = (key: TabKey) => {
    const oldIndex = TABS.findIndex((t) => t.key === activeTab);
    const newIndex = TABS.findIndex((t) => t.key === key);
    setTabDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(key);
  };

  // Riwayat kolaborasi pengguna ini, diambil dari dummyPelamarList berdasarkan nama
  const pengajuan = useMemo(
    () => dummyPelamarList.filter((p) => p.namaMahasiswa === publicUser.nama),
    [publicUser.nama]
  );

  const totalPengajuan = pengajuan.length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima" || p.status === "Selesai").length;
  const level = publicUser.level || Math.floor(totalPengajuan / 2) + 1;
  const earnedBadges = badgeList.filter((b) => b.check(totalPengajuan, diterima));
  const lockedBadges = badgeList.filter((b) => !b.check(totalPengajuan, diterima));

  const skillsList = publicUser.skills || [];
  const minatList = publicUser.minatKategori || [];

  const animatedSkillsCount = useSpringNumber(skillsList.length);
  const animatedMinatCount = useSpringNumber(minatList.length);

  const initials = publicUser.nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-paper text-ink pb-20 overflow-x-visible">
      <Navbar />

      <AnimatePresence>
        {isPhotoOpen && publicUser.foto && (
          <PhotoLightbox src={publicUser.foto} alt={publicUser.nama} onClose={() => setIsPhotoOpen(false)} />
        )}
      </AnimatePresence>

      {/* Hero Banner Area */}
      <div className="-mt-20 w-full bg-paper">
        <div className="w-full bg-gradient-to-b from-ink via-ink/90 to-paper relative pt-24 pb-24 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent)]" />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 relative overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-16 sm:-mt-20 gap-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-20">
              <div className="relative group shrink-0">
                <div
                  onClick={() => publicUser.foto && setIsPhotoOpen(true)}
                  className={`h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-paper bg-[#1c2938] shadow-lg transition-transform duration-200 group-hover:scale-105 ${
                    publicUser.foto ? "cursor-zoom-in" : ""
                  }`}
                >
                  {publicUser.foto ? (
                    <motion.img
                      layoutId="public-profile-avatar-photo"
                      src={publicUser.foto}
                      alt={publicUser.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-4xl sm:text-5xl font-bold text-white bg-[#1c2938]">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                  <RevealText>{publicUser.nama}</RevealText>
                </h2>
                <p className="text-xs sm:text-sm font-medium text-steel mt-0.5">
                  {[publicUser.prodi, publicUser.universitas].filter(Boolean).join(" • ")}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="rounded-lg bg-bridge-gold/10 px-2.5 py-1 text-xs font-bold text-ink border border-bridge-gold/40 flex items-center gap-1.5">
                    <IconTrophy className="w-3.5 h-3.5 text-bridge-gold" />
                    Lvl {level} Mahasiswa Aktif
                  </span>
                  <span className="rounded-lg bg-paper px-2.5 py-1 text-xs font-semibold text-ink/80 border border-steel/20">
                    {animatedSkillsCount} Skills
                  </span>
                  <span className="rounded-lg bg-paper px-2.5 py-1 text-xs font-semibold text-ink/80 border border-steel/20">
                    {animatedMinatCount} Minat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar — shared layoutId pill slides between tabs */}
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
                    className={`relative isolate flex items-center gap-2.5 rounded-xl px-5 py-3 sm:px-6 text-xs sm:text-sm font-bold transition-colors duration-150 active:scale-95 border ${
                      isActive
                        ? "border-ink text-paper"
                        : "border-steel/20 bg-paper text-steel hover:text-ink hover:border-steel/40"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="public-active-tab-pill"
                        className="absolute inset-0 -z-10 rounded-xl bg-ink shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <IconComp className="w-4 h-4 text-bridge-gold" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-8 lg:px-12 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Sidebar — cards get a subtle micro-nudge replay on tab change */}
          <div className="lg:col-span-4 space-y-6">
            <RevealCard nudgeKey={`bio-${activeTab}`} delay={0} className="rounded-2xl border border-steel/20 bg-paper p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconFileText className="w-4 h-4 text-bridge-gold" />
                Bio & Ringkasan Diri
              </h3>
              <p className="text-xs leading-relaxed text-steel">
                {publicUser.ringkasan || "Belum ada ringkasan diri."}
              </p>
            </RevealCard>

            <RevealCard nudgeKey={`info-${activeTab}`} delay={0.03} className="rounded-2xl border border-steel/20 bg-paper p-5">
              <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                <IconPin className="w-4 h-4 text-bridge-gold" />
                Informasi & Sistem Kerja
              </h3>
              <div className="space-y-3 text-xs text-ink/80">
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Universitas</span>
                  <span className="font-semibold text-ink">{publicUser.universitas || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Program Studi</span>
                  <span className="font-semibold text-ink">{publicUser.prodi || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Semester</span>
                  <span className="font-semibold text-ink">{publicUser.semester || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Tipe Kolaborasi</span>
                  <span className="font-semibold text-ink">{publicUser.preferensiTipe || "Semua"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-steel/70 font-medium">Sistem Kerja</span>
                  <span className="font-semibold text-ink">{publicUser.sistemKerja || "Remote"}</span>
                </div>
              </div>
            </RevealCard>

            <RevealCard nudgeKey={`skills-${activeTab}`} delay={0.06} className="rounded-2xl border border-steel/20 bg-paper p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconWrench className="w-4 h-4 text-bridge-gold" />
                Skill & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.length > 0 ? (
                  skillsList.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg border border-steel/20 bg-paper px-2.5 py-1 text-xs font-medium text-ink/80 hover:bg-steel/10 transition-colors"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-steel/70">Belum ada skill ditambahkan.</p>
                )}
              </div>
            </RevealCard>

            <RevealCard nudgeKey={`minat-${activeTab}`} delay={0.09} className="rounded-2xl border border-steel/20 bg-paper p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconTarget className="w-4 h-4 text-bridge-gold" />
                Kategori Minat
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {minatList.length > 0 ? (
                  minatList.map((m) => (
                    <span
                      key={m}
                      className="rounded-lg border border-steel/20 bg-paper px-2.5 py-1 text-xs font-medium text-ink/80 hover:bg-steel/10 transition-colors flex items-center gap-1.5"
                    >
                      <IconCheck className="w-3 h-3 text-bridge-gold" />
                      {m}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-steel/70">Belum ada minat dipilih.</p>
                )}
              </div>
            </RevealCard>
          </div>

          {/* Right Column Feed */}
          <div className="lg:col-span-8 space-y-6">
            <RevealCard delay={0.05} className="z-30 relative overflow-visible">
              <LevelGamificationCard level={level} totalPengajuan={totalPengajuan} />
            </RevealCard>

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
                  {/* TAB 1: DETAIL PROFIL (Pure View-Only) */}
                  {activeTab === "profile" && (
                    <div className="rounded-2xl border border-steel/20 bg-paper p-6 sm:p-8">
                      <h3 className="text-base font-bold text-ink border-b border-steel/10 pb-4 mb-6 flex items-center gap-2">
                        <IconClipboard className="w-4 h-4 text-bridge-gold" />
                        Informasi Akun Lengkap
                      </h3>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <InfoField label="Nama Lengkap" value={publicUser.nama} />
                          <InfoField label="Email" value={publicUser.email} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-steel/10 pt-5">
                          <InfoField label="Universitas" value={publicUser.universitas || ""} />
                          <InfoField label="Program Studi" value={publicUser.prodi || ""} />
                          <InfoField label="Semester" value={publicUser.semester || ""} />
                        </div>

                        <div className="border-t border-steel/10 pt-5">
                          <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase flex items-center gap-1.5">
                            <IconTarget className="w-3.5 h-3.5 text-bridge-gold" />
                            Kategori Proyek Minat
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {minatList.length > 0 ? (
                              minatList.map((m) => (
                                <span
                                  key={m}
                                  className="rounded-lg border border-steel/20 bg-paper px-3 py-1.5 text-xs font-medium text-ink/80 flex items-center gap-1.5"
                                >
                                  <IconCheck className="w-3 h-3 text-bridge-gold" />
                                  {m}
                                </span>
                              ))
                            ) : (
                              <p className="text-xs text-steel/70">Belum ada minat dipilih.</p>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-steel/10 pt-5">
                          <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase flex items-center gap-1.5">
                            <IconWrench className="w-3.5 h-3.5 text-bridge-gold" />
                            Skill & Tools
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {skillsList.length > 0 ? (
                              skillsList.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-lg border border-steel/20 bg-paper px-3 py-1.5 text-xs font-medium text-ink/80"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <p className="text-xs text-steel/70">Belum ada skill ditambahkan.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: AKTIVITAS PUBLIK */}
                  {activeTab === "activity" && <PublicActivitySection nama={publicUser.nama} />}

                  {/* TAB 3: PENCAPAIAN */}
                  {activeTab === "pencapaian" && (
                    <div className="rounded-2xl border border-steel/20 bg-paper p-6 sm:p-8">
                      <h3 className="text-base font-bold text-ink border-b border-steel/10 pb-4 mb-6 flex items-center gap-2">
                        <IconTrophy className="w-5 h-5 text-bridge-gold" />
                        Pencapaian & Badge Profil
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {earnedBadges.map((b) => (
                          <div
                            key={b.id}
                            className="group rounded-xl border border-bridge-gold/30 bg-bridge-gold/10 p-4 transition-colors duration-200 hover:border-bridge-gold/40"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-ink flex items-center gap-2">
                                <IconTrophy className="w-4 h-4 text-bridge-gold group-hover:scale-110 transition-transform" />
                                {b.nama}
                              </p>
                              <IconSparkles className="w-4 h-4 text-bridge-gold opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="mt-2 text-xs text-steel leading-relaxed">{b.deskripsi}</p>
                            <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-bridge-gold/40 px-2 py-0.5 text-[10px] font-bold text-ink">
                              <IconCheck className="w-3 h-3 text-bridge-gold" />
                              Unlocked
                            </span>
                          </div>
                        ))}
                        {lockedBadges.map((b) => (
                          <div key={b.id} className="rounded-xl border border-steel/20 bg-paper p-4 opacity-60">
                            <p className="text-sm font-bold text-steel flex items-center gap-2">
                              <IconLock className="w-4 h-4 text-bridge-gold" />
                              {b.nama}
                            </p>
                            <p className="mt-1 text-xs text-steel/70 leading-relaxed">{b.deskripsi}</p>
                            <span className="mt-3 inline-block rounded-md bg-steel/20 px-2 py-0.5 text-[10px] font-medium text-steel">
                              Terkunci
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: STATUS KOLABORASI */}
                  {activeTab === "pengajuan" && (
                    <div className="rounded-2xl border border-steel/20 bg-paper p-6 sm:p-8">
                      <div className="flex items-center justify-between border-b border-steel/10 pb-4 mb-6">
                        <h3 className="text-base font-bold text-ink flex items-center gap-2">
                          <IconRocket className="w-5 h-5 text-bridge-gold" />
                          Riwayat Kolaborasi
                        </h3>
                        <Link href="/kolaborasi" className="text-xs font-semibold text-bridge-gold hover:underline flex items-center gap-1">
                          Cari Peluang →
                        </Link>
                      </div>

                      {pengajuan.length > 0 ? (
                        <div className="divide-y divide-steel/10">
                          {pengajuan.map((p) => (
                            <div key={p.id} className="py-4 flex items-center justify-between hover:bg-paper px-3 rounded-xl transition">
                              <div>
                                <p className="text-sm font-bold text-ink">{p.kolaborasiJudul}</p>
                                <p className="text-xs text-steel">{p.tanggal}</p>
                              </div>
                              <span className="rounded-full bg-steel/10 px-3 py-1 text-xs font-semibold text-ink/80">
                                {p.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-steel/70 text-center py-8">Belum ada riwayat kolaborasi.</p>
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