"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getUserProfileById, badgeList } from "@/lib/dummy-data";

/* ------------------------------------------------------------------ */
/* SVG Icon Components                                                */
/* ------------------------------------------------------------------ */

function IconCheck({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconTrophy({ className = "w-4 h-4 text-sky" }: { className?: string }) {
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

function IconRocket({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5l-3-3c-1 0-1.79.79-1.5 2.5z" />
      <path d="M12 15l-3-3 8.5-8.5c1.2-1.2 3.1-1.2 4.3 0s1.2 3.1 0 4.3L12 15z" />
      <path d="M9 18l3 3" />
    </svg>
  );
}

function IconActivity({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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

function IconPin({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.5-6h1.5V5H3v6h1.5L5 17z" />
    </svg>
  );
}

function IconClipboard({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconTarget({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconWrench({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconLock({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconFlame({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
      <path d="M12 2c1.72 2.76 4.5 4.2 4.5 8.5a6.5 6.5 0 1 1-13 0c0-4.3 2.78-5.74 4.5-8.5 1.25 2.5 2.75 3.5 4 0z" />
    </svg>
  );
}

function IconCheckSquare({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconSparkles({ className = "w-4 h-4 text-sky" }: { className?: string }) {
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
import { getGamificationMetrics } from "@/lib/gamification";

function LevelGamificationCard({ totalXp = 0, pts }: { totalXp: number; pts?: number }) {
  const gMetrics = getGamificationMetrics(totalXp, pts);
  const animatedLevel = useSpringNumber(gMetrics.level);

  return (
    <div className="relative group cursor-default overflow-visible z-30 w-full">
      <div className="relative overflow-hidden w-full rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:border-sky/60">
        <CursorGlow />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky/40 bg-sky/15 text-ocean">
              <IconTrophy className="w-6 h-6 text-ocean" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-base font-black text-ink">
                  Level {animatedLevel}
                </span>
                <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold ${gMetrics.tierInfo.badgeColor} ${gMetrics.tierInfo.borderColor}`}>
                  {gMetrics.tier} • {gMetrics.tierTitle}
                </span>
                <span className="rounded-lg bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-xs font-mono font-bold">
                  {gMetrics.pts} Pts
                </span>
              </div>
              <p className="text-xs text-steel font-medium mt-1">
                {gMetrics.sisaMenujuLevel > 0
                  ? `Butuh ${gMetrics.sisaMenujuLevel} XP lagi untuk naik ke Level ${gMetrics.level + 1}`
                  : "Siap naik ke level berikutnya!"}
              </p>
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold text-ink/80 mb-1.5">
              <span>Progres Level {gMetrics.level} → {gMetrics.level + 1}</span>
              <span className="text-primary font-mono">{gMetrics.xpInCurrentLevel}/{gMetrics.xpSpanForNextLevel} XP ({gMetrics.progressPercent}%)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-steel/10 overflow-hidden border border-steel/20">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${gMetrics.progressPercent}%` }}
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
function InfoField({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
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
/* Public Activity Section Component                                   */
/* ------------------------------------------------------------------ */
function PublicActivitySection({
  publicUser,
}: {
  publicUser: any;
}) {
  const [filter, setFilter] = useState<"semua" | "kolaborasi" | "skill" | "pencapaian">("semua");

  const pengajuan = publicUser.pengajuan || [];
  const dbBadges = publicUser.badges || [];
  const totalPengajuan = pengajuan.length;
  const streak = publicUser.streakCount ?? 0;
  const ptsValue = publicUser.pts ?? publicUser.xp ?? 0;
  const responseRate = publicUser.responseRate ?? 0;

  const statCards = [
    { label: "Total Kontribusi", value: totalPengajuan, suffix: " Aksi", extra: "", desc: "Total pengajuan & aktivitas", icon: IconActivity },
    { label: "Streak Keaktifan", value: streak, suffix: " Hari", extra: "", desc: "Aktif berturut-turut", icon: IconFlame },
    { label: "Reputasi Publik", value: ptsValue, suffix: " Pts", extra: "", desc: "Skor Pts keaktifan platform", icon: IconTrophy },
    { label: "Respon Rate", value: Math.round(responseRate), suffix: "%", extra: "", desc: "Kecepatan balasan & partisipasi", icon: IconCheckSquare },
  ];

  const rawActivities = useMemo(() => {
    const list: Array<{
      id: string;
      kategori: "kolaborasi" | "skill" | "pencapaian";
      judul: string;
      deskripsi: string;
      waktu: string;
      badgeText: string;
      badgeColor: string;
    }> = [];

    // 1. Tambahkan Badge Unlocked sebagai Aktivitas Pencapaian
    const unlockedBadges = dbBadges.filter((b: any) => b.isUnlocked);
    unlockedBadges.forEach((b: any) => {
      list.push({
        id: `badge-${b.id}`,
        kategori: "pencapaian",
        judul: `Badge Peroleh: ${b.namaBadge || b.nama}`,
        deskripsi: `${b.deskripsi} (+${b.xpBonus || 0} XP/Pts)`,
        waktu: b.unlockedAt ? new Date(b.unlockedAt).toLocaleDateString("id-ID") : "Terbaru",
        badgeText: `Badge (${b.kategori || "Pencapaian"})`,
        badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      });
    });

    // 2. Tambahkan Pengajuan Kolaborasi
    pengajuan.forEach((p: any, idx: number) => {
      list.push({
        id: `pengajuan-${p.id || idx}`,
        kategori: "kolaborasi",
        judul: `Pengajuan Proyek: ${p.judul || p.kolaborasiJudul}`,
        deskripsi: `Mengirimkan pendaftaran kolaborasi ke ${p.perusahaan} dengan status '${p.status}'.`,
        waktu: p.tanggal || "Terbaru",
        badgeText: "Kolaborasi",
        badgeColor: "bg-sky/15 text-ocean border-sky/40",
      });
    });

    // 3. Tambahkan Pembaruan Skill
    if (publicUser.skills && publicUser.skills.length > 0) {
      list.push({
        id: "act-skills",
        kategori: "skill",
        judul: "Pembaruan Skill & Portofolio",
        deskripsi: `Keahlian terdaftar: ${publicUser.skills.slice(0, 4).join(", ")}${publicUser.skills.length > 4 ? "..." : ""}.`,
        waktu: "Terdaftar",
        badgeText: "Skill & Tools",
        badgeColor: "bg-sky/15 text-ocean border-sky/40",
      });
    }

    if (list.length === 0) {
      list.push({
        id: "act-empty",
        kategori: "kolaborasi",
        judul: "Akun Baru Terdaftar",
        deskripsi: "Belum ada riwayat aktivitas kolaborasi publik yang tercatat.",
        waktu: "Baru saja",
        badgeText: "Profil Update",
        badgeColor: "bg-steel/10 text-ink/80 border-steel/20",
      });
    }

    return list;
  }, [pengajuan, dbBadges, publicUser.skills]);

  const filteredActivities = useMemo(() => {
    if (filter === "semua") return rawActivities;
    return rawActivities.filter((a) => a.kategori === filter);
  }, [filter, rawActivities]);

  const heatmapDays = useMemo(() => {
    const days: Array<{ date: string; count: number }> = [];
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
              className="rounded-2xl border border-border bg-card p-4.5 hover:border-sky/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-steel">{stat.label}</span>
                <div className="p-2 rounded-xl bg-sky/15 text-ocean border border-sky/40">
                  <StatIcon className="w-4 h-4 text-ocean" />
                </div>
              </div>
              <p className="text-2xl font-black text-ink mt-2">
                {animatedValue}
                {stat.suffix}{" "}
                {stat.extra && <span className="text-xs font-semibold text-primary">{stat.extra}</span>}
              </p>
              <p className="text-[11px] text-steel/70 mt-1">{stat.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/10 pb-4 mb-6">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <IconRocket className="w-5 h-5 text-ink/60" />
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
                    : "border border-border bg-card text-steel hover:bg-paper"
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
              <span className="absolute -left-[19px] top-1.5 h-3 w-3 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20 group-hover:scale-125 transition-transform" />
              <div className="rounded-xl border border-border bg-card p-4 hover:border-steel/40 transition-all">
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
  const rawProfileId = resolvedParams.id;

  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [tabDirection, setTabDirection] = useState(1);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [badgePage, setBadgePage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      console.log("Fetching profile for:", rawProfileId);
      setIsLoading(true);
      try {
        const res = await fetch(`/api/profile/${rawProfileId}`);
        console.log("Response status:", res.status);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error("Fetch error:", body);
          if (isMounted) setErrorMsg(body.error || "Profil tidak ditemukan");
        } else {
          const data = await res.json();
          console.log("Fetched profile data:", data);
          if (isMounted) setProfileData(data);
        }
      } catch (err: any) {
        console.error("Exception during fetch:", err);
        if (isMounted) setErrorMsg(err.message || "Gagal memuat profil");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [rawProfileId]);

  const publicUser: any = useMemo(() => {
    if (profileData) {
      console.log("DEBUG [PublicProfilePage] Mapping profileData:", profileData);
      return {
        id: profileData.id,
        nama: profileData.nama,
        email: profileData.email,
        universitas: profileData.universitas || "Universitas Terdaftar",
        prodi: profileData.prodi || "Program Studi",
        semester: profileData.semester ? profileData.semester.toString().replace(/^Semester\s+/i, "") : "-",
        sistemKerja: profileData.preferensiLokasi || "Remote",
        preferensiTipe: profileData.preferensiTipe || "Semua",
        ringkasan: profileData.ringkasan || "",
        foto: profileData.foto,
        skills: profileData.skills || [],
        minatKategori: profileData.minatKategori || [],
        level: profileData.level || 1,
        xp: profileData.xp || 0,
        pts: profileData.pts || 0,
        tier: profileData.tier || "Novice",
        tierTitle: profileData.tierTitle || "Pendatang Baru",
        streakCount: profileData.streakCount || 0,
        reputationScore: profileData.reputationScore || 0,
        responseRate: profileData.responseRate || 0,
        badges: profileData.badges || [],
        pengajuan: profileData.pengajuan || [],
      };
    }
    const dummy = getUserProfileById(rawProfileId);
    return {
      ...dummy,
      xp: (dummy as any).xp || 0,
      pts: (dummy as any).pts || 0,
      badges: [],
      pengajuan: [],
    };
  }, [profileData, rawProfileId]);

  const handleTabChange = (key: TabKey) => {
    const oldIndex = TABS.findIndex((t) => t.key === activeTab);
    const newIndex = TABS.findIndex((t) => t.key === key);
    setTabDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(key);
  };

  const pengajuan = publicUser.pengajuan || [];
  const dbBadges = publicUser.badges || [];

  const skillsList = publicUser.skills || [];
  const minatList = publicUser.minatKategori || [];

  useEffect(() => {
    if (profileData) {
      console.log("DEBUG [PublicProfilePage] profileData exists, mapping to publicUser.");
    } else {
      console.log("DEBUG [PublicProfilePage] profileData is null. Checking dummy data.");
    }
    console.log("DEBUG [PublicProfilePage] skillsList:", skillsList);
    console.log("DEBUG [PublicProfilePage] minatList:", minatList);
  }, [profileData, skillsList, minatList]);

  const animatedSkillsCount = useSpringNumber(skillsList.length);
  const animatedMinatCount = useSpringNumber(minatList.length);

  const gMetrics = getGamificationMetrics(publicUser.xp || 0, publicUser.pts);
  const level = gMetrics.level;

  const initials = (publicUser.nama || "Mahasiswa")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-clouds text-ink pt-24 pb-20 overflow-x-visible">
      <AnimatePresence>
        {isPhotoOpen && publicUser.foto && (
          <PhotoLightbox src={publicUser.foto} alt={publicUser.nama} onClose={() => setIsPhotoOpen(false)} />
        )}
      </AnimatePresence>

      {/* Hero Banner Area */}
      <div className="-mt-20 w-full bg-clouds">
        <div className="w-full bg-gradient-to-b from-ink via-ink/90 to-clouds relative pt-24 pb-24 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent)]" />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 relative overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-16 sm:-mt-20 gap-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-20">
              <div className="relative group shrink-0">
                <div
                  onClick={() => publicUser.foto && setIsPhotoOpen(true)}
                  className={`h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-clouds bg-card shadow-lg transition-transform duration-200 group-hover:scale-105 ${
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
                    <div className="flex h-full w-full items-center justify-center font-display text-4xl sm:text-5xl font-bold text-steel/70">
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
                  <span className="rounded-lg bg-sky/15 px-2.5 py-1 text-xs font-bold text-ink border border-sky/40 flex items-center gap-1.5">
                    <IconTrophy className="w-3.5 h-3.5 text-ocean" />
                    Lvl {level} • {gMetrics.tier} ({gMetrics.tierTitle})
                  </span>
                  <span className="rounded-lg bg-amber-100 text-amber-900 px-2.5 py-1 text-xs font-mono font-bold border border-amber-300">
                    {gMetrics.pts} Pts
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
                    className={`relative isolate flex items-center gap-2.5 rounded-full px-5 py-3 sm:px-6 text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 ${
                      isActive
                        ? "text-paper shadow-md"
                        : "bg-card text-steel shadow-sm hover:text-ink hover:shadow-md"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-tab-pill"
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

      {/* Main Content Layout */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-8 lg:px-12 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Sidebar — cards get a subtle micro-nudge replay on tab change */}
          <div className="lg:col-span-4 space-y-6">
            <RevealCard nudgeKey={`bio-${activeTab}`} delay={0} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconFileText className="w-4 h-4 text-ink/60" />
                Bio & Ringkasan Diri
              </h3>
              <p className="text-xs leading-relaxed text-steel">
                {publicUser.ringkasan || "Belum ada ringkasan atau deskripsi diri yang ditambahkan."}
              </p>
            </RevealCard>

            <RevealCard nudgeKey={`info-${activeTab}`} delay={0.03} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                <IconPin className="w-4 h-4 text-ink/60" />
                Informasi & Sistem Kerja
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Universitas", value: publicUser.universitas || "—", icon: IconUser },
                  { label: "Program Studi", value: publicUser.prodi || "—", icon: IconClipboard },
                  {
                    label: "Semester",
                    value: publicUser.semester && publicUser.semester !== "—" && publicUser.semester !== "-"
                      ? publicUser.semester.toString().toLowerCase().includes("semester")
                        ? publicUser.semester
                        : `Semester ${publicUser.semester}`
                      : "—",
                    icon: IconTarget,
                  },
                  { label: "Tipe Kolaborasi", value: publicUser.preferensiTipe || "Semua", icon: IconRocket },
                ].map((f) => {
                  const FieldIcon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="group rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "#EAF2FB",
                        boxShadow: "5px 5px 12px rgba(23,59,108,0.12), -5px -5px 12px rgba(255,255,255,0.9)",
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-ocean"
                          style={{ boxShadow: "inset 2px 2px 5px rgba(23,59,108,0.15), inset -2px -2px 5px rgba(255,255,255,0.8)" }}
                        >
                          <FieldIcon className="w-3 h-3 text-ocean" />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-wide text-steel/70 font-semibold truncate">
                          {f.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-ink truncate">{f.value}</p>
                    </div>
                  );
                })}
                <div
                  className="col-span-2 group rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "#EAF2FB",
                    boxShadow: "5px 5px 12px rgba(23,59,108,0.12), -5px -5px 12px rgba(255,255,255,0.9)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-ocean"
                      style={{ boxShadow: "inset 2px 2px 5px rgba(23,59,108,0.15), inset -2px -2px 5px rgba(255,255,255,0.8)" }}
                    >
                      <IconWrench className="w-3 h-3 text-ocean" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wide text-steel/70 font-semibold">
                      Sistem Kerja
                    </span>
                  </div>
                  <p className="text-xs font-bold text-ink">{publicUser.sistemKerja || "Remote"}</p>
                </div>
              </div>
            </RevealCard>

            <RevealCard nudgeKey={`skills-${activeTab}`} delay={0.06} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconWrench className="w-4 h-4 text-ink/60" />
                Skill & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.length > 0 ? (
                  skillsList.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-ink/80 hover:bg-steel/10 transition-colors"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-steel/70">Belum ada skill ditambahkan.</p>
                )}
              </div>
            </RevealCard>

            <RevealCard nudgeKey={`minat-${activeTab}`} delay={0.09} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconTarget className="w-4 h-4 text-ink/60" />
                Kategori Minat
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {minatList.length > 0 ? (
                  minatList.map((m: string) => (
                    <span
                      key={m}
                      className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-ink/80 hover:bg-steel/10 transition-colors flex items-center gap-1.5"
                    >
                      <IconCheck className="w-3 h-3 text-primary" />
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
              <LevelGamificationCard totalXp={publicUser.xp} pts={publicUser.pts} />
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
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                      <h3 className="text-base font-bold text-ink border-b border-steel/10 pb-4 mb-6 flex items-center gap-2">
                        <IconClipboard className="w-4 h-4 text-ink/60" />
                        Informasi Akun Lengkap
                      </h3>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <InfoField label="Nama Lengkap" value={publicUser.nama} icon={IconUser} />
                          <InfoField label="Email" value={publicUser.email} icon={IconFileText} />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-steel/10 pt-5">
                          <InfoField label="Universitas" value={publicUser.universitas || ""} icon={IconPin} />
                          <InfoField label="Program Studi" value={publicUser.prodi || ""} icon={IconClipboard} />
                          <InfoField
                            label="Semester"
                            value={
                              publicUser.semester && publicUser.semester !== "—" && publicUser.semester !== "-"
                                ? publicUser.semester.toString().toLowerCase().includes("semester")
                                  ? publicUser.semester
                                  : `Semester ${publicUser.semester}`
                                : "—"
                            }
                            icon={IconTarget}
                          />
                        </div>

                        <div className="border-t border-steel/10 pt-5">
                          <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase flex items-center gap-1.5">
                            <IconTarget className="w-3.5 h-3.5 text-ink/60" />
                            Kategori Proyek Minat
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {minatList.length > 0 ? (
                              minatList.map((m: string) => (
                                <span
                                  key={m}
                                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink/80 flex items-center gap-1.5"
                                >
                                  <IconCheck className="w-3 h-3 text-primary" />
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
                            <IconWrench className="w-3.5 h-3.5 text-ink/60" />
                            Skill & Tools
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {skillsList.length > 0 ? (
                              skillsList.map((s: string) => (
                                <span
                                  key={s}
                                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink/80"
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
                  {activeTab === "activity" && <PublicActivitySection publicUser={publicUser} />}

                  {/* TAB 3: PENCAPAIAN */}
                  {activeTab === "pencapaian" && (
                    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-steel/10 pb-4 mb-6 gap-3">
                        <div>
                          <h3 className="text-base font-bold text-ink flex items-center gap-2">
                            <IconTrophy className="w-5 h-5 text-ink/60" />
                            Pencapaian & Badge Profil
                          </h3>
                          <p className="text-xs text-steel mt-0.5">
                            Total {dbBadges.length} Badge • {dbBadges.filter((b: any) => b.isUnlocked).length} Unlocked
                          </p>
                        </div>
                      </div>

                      {(() => {
                        const BADGES_PER_PAGE = 12;
                        const totalBadgePages = Math.ceil(dbBadges.length / BADGES_PER_PAGE) || 1;
                        const currentPageBadges = dbBadges.slice((badgePage - 1) * BADGES_PER_PAGE, badgePage * BADGES_PER_PAGE);

                        return (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {currentPageBadges.map((b: any) => (
                                <div
                                  key={b.id}
                                  className={`group rounded-xl border p-4 transition-all duration-200 ${
                                    b.isUnlocked
                                      ? "border-sky/40 bg-sky/15 hover:border-sky/60"
                                      : "border-border bg-card opacity-60"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                      {b.iconUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={b.iconUrl} alt={b.namaBadge || b.nama} className="w-7 h-7 object-contain" />
                                      ) : (
                                        <IconTrophy className={`w-4 h-4 ${b.isUnlocked ? "text-ocean" : "text-steel"}`} />
                                      )}
                                      <p className="text-xs font-bold text-ink">{b.namaBadge || b.nama}</p>
                                    </div>
                                    {b.isUnlocked && (
                                      <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                        +{b.xpBonus || 0} XP
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-2 text-[11px] text-steel leading-relaxed">{b.deskripsi}</p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[9px] font-mono font-medium text-steel/70">{b.kategori}</span>
                                    {b.isUnlocked ? (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-sky/40 px-2 py-0.5 text-[10px] font-bold text-ocean">
                                        <IconCheck className="w-3 h-3 text-ocean" />
                                        Unlocked
                                      </span>
                                    ) : (
                                      <span className="inline-block rounded-md bg-steel/20 px-2 py-0.5 text-[10px] font-medium text-steel">
                                        Terkunci
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {totalBadgePages > 1 && (
                              <div className="mt-6 flex items-center justify-between border-t border-steel/10 pt-4">
                                <p className="text-xs text-steel font-medium">
                                  Halaman <span className="font-bold text-ink">{badgePage}</span> dari <span className="font-bold text-ink">{totalBadgePages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={badgePage <= 1}
                                    onClick={() => setBadgePage((prev) => Math.max(1, prev - 1))}
                                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 hover:bg-paper transition"
                                  >
                                    ← Sebelum
                                  </button>
                                  <button
                                    type="button"
                                    disabled={badgePage >= totalBadgePages}
                                    onClick={() => setBadgePage((prev) => Math.min(totalBadgePages, prev + 1))}
                                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 hover:bg-paper transition"
                                  >
                                    Selanjutnya →
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
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