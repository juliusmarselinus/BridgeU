"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { badgeList } from "@/lib/dummy-data";
import { ModalPicker } from "@/app/daftar/components/ModalPicker";
import { supabase } from "@/lib/supabase";
import { getGamificationMetrics } from "@/lib/gamification";

type StoredUser = {
  nama: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  minatKategori?: string[];
  skills?: string[];
  preferensiTipe?: string;
  preferensiLokasi?: string;
  ringkasan?: string;
  foto?: string;
};

type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: string;
  tujuan: string;
  tanggal: string;
};

type ReferenceData = {
  universitas: string[];
  prodi: string[];
  skills: string[];
  kategoriMinat: string[];
};

export type DbBadge = {
  id: number;
  kodeBadge: string;
  namaBadge: string;
  deskripsi: string;
  iconUrl: string;
  kategori: string;
  xpBonus: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
};

/* ------------------------------------------------------------------ */
/* Badge Unlock Popup Modal Component                                  */
/* ------------------------------------------------------------------ */
function BadgeUnlockModal({
  badge,
  onClose,
}: {
  badge: DbBadge;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/70 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-sky/40 bg-card p-6 text-center shadow-2xl"
      >
        {/* Glow & Confetti Effect Backdrop */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky/30 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-200/30 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-sky/40 bg-sky/15 p-4 shadow-xl"
          >
            {badge.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badge.iconUrl} alt={badge.namaBadge} className="h-full w-full object-contain" />
            ) : (
              <IconTrophy className="h-12 w-12 text-ocean" />
            )}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-ink shadow-md"
            >
              <IconSparkles className="h-4 h-4 text-white" />
            </motion.div>
          </motion.div>

          <span className="rounded-full bg-sky/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ocean border border-sky/30">
            🎉 Badge Terbuka Baru!
          </span>

          <h3 className="mt-3 text-xl font-black text-ink">{badge.namaBadge}</h3>
          <p className="mt-1.5 text-xs text-steel leading-relaxed">{badge.deskripsi}</p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5"
          >
            <IconSparkles className="h-4 h-4 text-emerald-600" />
            <span className="text-sm font-extrabold text-emerald-800">
              +{badge.xpBonus} XP & Pts Didapatkan!
            </span>
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-ink py-3 text-xs font-bold text-paper shadow-md transition-all hover:bg-ink/90 active:scale-95"
          >
            Klaim & Lanjutkan
          </button>
        </div>
      </motion.div>
    </div>
  );
}
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SEMESTER_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

/* ------------------------------------------------------------------ */
/* SVG Icon Components                                                */
/* sky dipakai HANYA untuk icon di atas background sendiri              */
/* (badge, pill, avatar ring). Icon judul section pakai ink/60 biar    */
/* kontrasnya cukup di atas bg-paper.                                  */
/* ------------------------------------------------------------------ */

function IconCheck({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconPencil({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconSave({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function IconCamera({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconRotate({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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

function IconLogout({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
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

function IconAlertTriangle({ className = "w-4 h-4 text-sky" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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
function PhotoLightbox({ src, onClose }: { src: string; onClose: () => void }) {
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
        layoutId="profile-avatar-photo"
        src={src}
        alt="Foto profil diperbesar"
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="h-[70vmin] w-[70vmin] max-h-[80vh] max-w-[90vw] rounded-full object-cover shadow-2xl cursor-default border-4 border-paper"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 bg-paper/10 text-paper backdrop-blur-sm transition hover:bg-paper/20 active:scale-90"
      >
        <IconX className="w-5 h-5 text-paper" />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Minimal Border-based Level Gamification Progress Bar Component      */
/* ------------------------------------------------------------------ */
function LevelGamificationCard({ totalXp = 0 }: { totalXp: number }) {
  const gMetrics = getGamificationMetrics(totalXp);
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
/* Modal Success Animated Pop-up (Dismiss speed: 1.8 detik)           */
/* ------------------------------------------------------------------ */
function SuccessModal({ onClose }: { onClose: () => void }) {
  const AUTO_DISMISS_MS = 1500;

  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200 cursor-pointer"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-paper p-6 text-center shadow-xl border border-steel/20 animate-in zoom-in-95 duration-200">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky/20 border border-sky/40">
          <svg viewBox="0 0 52 52" className="h-10 w-10">
            <circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-ocean animate-draw-circle"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ocean animate-draw-check"
              d="M14 27l7 7 17-17"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-ink">
          Berhasil Disimpan!
        </h3>
        <p className="mt-2 text-xs text-steel leading-relaxed">
          Perubahan profil kamu telah diperbarui dan siap ditampilkan.
        </p>

        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-steel/15">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              animation: `success-countdown ${AUTO_DISMISS_MS}ms linear forwards`,
            }}
          />
        </div>

        <style>{`
          .animate-draw-circle {
            stroke-dasharray: 145;
            stroke-dashoffset: 145;
            animation: drawCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            transform-origin: center;
          }
          .animate-draw-check {
            stroke-dasharray: 36;
            stroke-dashoffset: 36;
            animation: drawCheck 0.4s 0.45s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          @keyframes drawCircle {
            0% { stroke-dashoffset: 145; transform: rotate(-90deg); }
            100% { stroke-dashoffset: 0; transform: rotate(270deg); }
          }
          @keyframes drawCheck {
            0% { stroke-dashoffset: 36; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes success-countdown {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal Edit Foto Profil (Terpisah Independen)                        */
/* ------------------------------------------------------------------ */
function EditPhotoModal({
  imageSrc,
  onClose,
  onSave,
}: {
  imageSrc: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const PREVIEW_SIZE = 240;

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({ x: dragState.current.origX + dx, y: dragState.current.origY + dy });
  };

  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const OUTPUT = 400;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const scaleRatio = OUTPUT / PREVIEW_SIZE;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const baseScale = Math.max(PREVIEW_SIZE / naturalW, PREVIEW_SIZE / naturalH);
    const appliedScale = baseScale * (zoom / 100);

    const drawW = naturalW * appliedScale * scaleRatio;
    const drawH = naturalH * appliedScale * scaleRatio;

    ctx.translate(OUTPUT / 2 + offset.x * scaleRatio, OUTPUT / 2 + offset.y * scaleRatio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl border border-steel/20 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-steel/10">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <IconCamera className="w-4 h-4 text-ink/60" />
            Edit Foto Profil
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-steel/70 hover:bg-steel/10 hover:text-steel transition active:scale-90"
          >
            <IconX className="w-4 h-4 text-steel" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 pt-5">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative overflow-hidden rounded-full border-2 border-border bg-card"
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              cursor: dragState.current.dragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Preview foto"
              draggable={false}
              className="absolute left-1/2 top-1/2 max-w-none select-none transition-transform duration-75"
              style={{
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom / 100})`,
                width: "auto",
                height: PREVIEW_SIZE,
                objectFit: "cover",
              }}
            />
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="text-xs font-bold text-steel/70">−</span>
            <input
              type="range"
              min={50}
              max={200}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-steel/20 accent-primary transition-all"
            />
            <span className="text-xs font-bold text-steel/70">+</span>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-steel">{zoom}%</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handleRotate}
              aria-label="Putar gambar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-steel/20 text-steel transition hover:bg-paper active:scale-90"
            >
              <IconRotate className="w-4 h-4 text-steel" />
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-steel/20 px-4 py-2 text-xs font-semibold text-steel transition hover:bg-paper active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-ink px-5 py-2 text-xs font-semibold text-paper shadow-xs transition active:scale-95 flex items-center gap-1.5"
              >
                <IconCheck className="w-3.5 h-3.5 text-sky" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal Edit Data Profil (Single-Scroll Modal)                       */
/* Skill, minat, universitas & prodi sekarang di-fetch dari            */
/* /api/reference (data asli database), bukan dummy-data lagi.         */
/* ------------------------------------------------------------------ */
function EditProfileModal({
  user,
  isSaving = false,
  onClose,
  onSave,
}: {
  user: StoredUser;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (updated: StoredUser) => void;
}) {
  const [nama, setNama] = useState(user.nama || "");
  const [email, setEmail] = useState(user.email || "");
  const [universitas, setUniversitas] = useState(user.universitas || "");
  const [prodi, setProdi] = useState(user.prodi || "");
  const [semester, setSemester] = useState(user.semester || "");
  const [preferensiTipe, setPreferensiTipe] = useState(user.preferensiTipe || "Semua");
  const [preferensiLokasi, setPreferensiLokasi] = useState(user.preferensiLokasi || "Remote");
  const [ringkasan, setRingkasan] = useState(user.ringkasan || "");
  const [minatKategori, setMinatKategori] = useState<string[]>(user.minatKategori || []);
  const [skills, setSkills] = useState<string[]>(user.skills || []);

  const [activePicker, setActivePicker] = useState<"univ" | "prodi" | "semester" | null>(null);
  const [isCustomUniv, setIsCustomUniv] = useState(false);
  const [customUnivInput, setCustomUnivInput] = useState("");
  const [isCustomProdi, setIsCustomProdi] = useState(false);
  const [customProdiInput, setCustomProdiInput] = useState("");

  // Data referensi dari database
  const [refData, setRefData] = useState<ReferenceData>({
    universitas: [],
    prodi: [],
    skills: [],
    kategoriMinat: [],
  });
  const [isLoadingRef, setIsLoadingRef] = useState(true);
  const [refError, setRefError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchReference = async () => {
      setIsLoadingRef(true);
      setRefError("");
      try {
        const res = await fetch("/api/reference");
        if (!res.ok) throw new Error(`Gagal memuat referensi (${res.status})`);
        const data = await res.json();
        if (!cancelled) {
          setRefData({
            universitas: data.universitas ?? [],
            prodi: data.prodi ?? [],
            skills: data.skills ?? [],
            kategoriMinat: data.kategoriMinat ?? [],
          });
        }
      } catch (err) {
        console.error("Gagal memuat data referensi:", err);
        if (!cancelled) setRefError("Gagal memuat data skill/minat/universitas dari server.");
      } finally {
        if (!cancelled) setIsLoadingRef(false);
      }
    };

    fetchReference();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleMinat = (m: string) => {
    setMinatKategori((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return; // cegah submit dobel
    onSave({
      ...user,
      nama,
      email,
      universitas: isCustomUniv ? (customUnivInput || "Lainnya") : universitas,
      prodi: isCustomProdi ? (customProdiInput || "Lainnya") : prodi,
      semester,
      preferensiTipe,
      preferensiLokasi,
      ringkasan,
      minatKategori,
      skills,
    });
  };

  // Universitas & Prodi dari database + opsi "Lainnya" biar tetap bisa custom
  const universitasOptions = useMemo(() => [...refData.universitas, "Lainnya"], [refData.universitas]);
  const prodiOptions = useMemo(() => [...refData.prodi, "Lainnya"], [refData.prodi]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-paper shadow-2xl border border-steel/20 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-steel/10 px-6 py-4 shrink-0">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <IconPencil className="w-4 h-4 text-ink/60" />
            Edit Profil Data Diri
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-steel/70 hover:bg-steel/10 hover:text-steel transition active:scale-90"
          >
            <IconX className="w-4 h-4 text-steel" />
          </button>
        </div>

        <form id="edit-profile-form" onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
          {refError && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              {refError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Universitas</label>
              <button
                type="button"
                onClick={() => setActivePicker("univ")}
                className="mt-1 w-full flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-left text-ink hover:border-ink transition"
              >
                <span className="truncate">{isCustomUniv ? `Lainnya (${customUnivInput || "Belum diisi"})` : (universitas || "-- Pilih Universitas --")}</span>
                <span className="text-steel text-[10px]">▼</span>
              </button>
              {isCustomUniv && (
                <input
                  type="text"
                  value={customUnivInput}
                  onChange={(e) => setCustomUnivInput(e.target.value)}
                  placeholder="Ketik Nama Universitas..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-ink outline-none focus:border-ink"
                />
              )}
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Program Studi</label>
              <button
                type="button"
                onClick={() => setActivePicker("prodi")}
                className="mt-1 w-full flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-left text-ink hover:border-ink transition"
              >
                <span className="truncate">{isCustomProdi ? `Lainnya (${customProdiInput || "Belum diisi"})` : (prodi || "-- Pilih Prodi --")}</span>
                <span className="text-steel text-[10px]">▼</span>
              </button>
              {isCustomProdi && (
                <input
                  type="text"
                  value={customProdiInput}
                  onChange={(e) => setCustomProdiInput(e.target.value)}
                  placeholder="Ketik Nama Program Studi..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs text-ink outline-none focus:border-ink"
                />
              )}
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Semester</label>
              <button
                type="button"
                onClick={() => setActivePicker("semester")}
                className="mt-1 w-full flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-left text-ink hover:border-ink transition"
              >
                <span className="truncate">{semester ? `Semester ${semester}` : "-- Pilih Semester --"}</span>
                <span className="text-steel text-[10px]">▼</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-2">Kategori Proyek Minat</label>
            <div className="flex flex-wrap gap-1.5">
              {isLoadingRef ? (
                <p className="text-xs text-steel/60">Memuat kategori minat...</p>
              ) : refData.kategoriMinat.length === 0 ? (
                <p className="text-xs text-steel/60">Belum ada data kategori minat.</p>
              ) : (
                refData.kategoriMinat.map((m) => {
                  const selected = minatKategori.includes(m);
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleMinat(m)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                        selected
                          ? "bg-ink text-paper"
                          : "border border-border bg-card text-steel hover:bg-paper"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {m}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-2">Skill & Tools</label>
            <div className="flex flex-wrap gap-1.5">
              {isLoadingRef ? (
                <p className="text-xs text-steel/60">Memuat skill...</p>
              ) : refData.skills.length === 0 ? (
                <p className="text-xs text-steel/60">Belum ada data skill.</p>
              ) : (
                refData.skills.map((s) => {
                  const selected = skills.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                        selected
                          ? "bg-primary text-white"
                          : "border border-border bg-card text-steel hover:bg-paper"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {s}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Preferensi Tipe Kolaborasi</label>
              <select
                value={preferensiTipe}
                onChange={(e) => setPreferensiTipe(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
              >
                <option value="Semua">Semua</option>
                <option value="Akademik">Hanya Studi Kasus / Riset</option>
                <option value="Magang">Hanya Magang</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Preferensi Sistem Kerja</label>
              <select
                value={preferensiLokasi}
                onChange={(e) => setPreferensiLokasi(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Ringkasan Pengalaman & Motivasi</label>
            <textarea
              rows={3}
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-steel/10 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-steel/20 px-4 py-2.5 text-xs font-semibold text-steel hover:bg-paper transition active:scale-95"
          >
            Batal
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            className="rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-paper transition-colors flex items-center gap-2 active:scale-95"
          >
            <IconSave className="w-4 h-4 text-sky" />
            Simpan Perubahan
          </button>
        </div>

        {/* Modal Pickers — options sekarang dari database */}
        <ModalPicker
          isOpen={activePicker === "univ"}
          onClose={() => setActivePicker(null)}
          title="Pilih Universitas"
          options={universitasOptions}
          selectedValue={universitas}
          onSelect={(val) => {
            if (val === "Lainnya") {
              setIsCustomUniv(true);
              setUniversitas("Lainnya");
            } else {
              setIsCustomUniv(false);
              setUniversitas(val);
            }
            setActivePicker(null);
          }}
        />

        <ModalPicker
          isOpen={activePicker === "prodi"}
          onClose={() => setActivePicker(null)}
          title="Pilih Program Studi"
          options={prodiOptions}
          selectedValue={prodi}
          onSelect={(val) => {
            if (val === "Lainnya") {
              setIsCustomProdi(true);
              setProdi("Lainnya");
            } else {
              setIsCustomProdi(false);
              setProdi(val);
            }
            setActivePicker(null);
          }}
        />

        <ModalPicker
          isOpen={activePicker === "semester"}
          onClose={() => setActivePicker(null)}
          title="Pilih Semester"
          options={SEMESTER_OPTIONS}
          selectedValue={semester}
          allowLainnya={false}
          onSelect={(val) => {
            setSemester(val);
            setActivePicker(null);
          }}
        />
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
  user,
  userMetrics,
  pengajuan = [],
}: {
  user?: StoredUser | null;
  userMetrics?: {
    xp: number;
    streakCount: number;
    reputationScore: number;
    responseRate: number;
  };
  pengajuan?: Pengajuan[];
}) {
  const [filter, setFilter] = useState<"semua" | "kolaborasi" | "skill" | "pencapaian">("semua");

  const totalPengajuan = pengajuan.length;
  const streak = userMetrics?.streakCount ?? 0;
  const reputation = userMetrics?.reputationScore ?? 0;
  const responseRate = userMetrics?.responseRate ?? 0;

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

  const statCards = [
    { label: "Total Kontribusi", value: totalPengajuan, suffix: " Aksi", extra: "", desc: "Total pengajuan & aktivitas", icon: IconActivity },
    { label: "Streak Keaktifan", value: streak, suffix: " Hari", extra: "", desc: "Aktif berturut-turut", icon: IconFlame },
    { label: "Reputasi Publik", value: reputation, suffix: " Pts", extra: "", desc: "Skor keaktifan platform", icon: IconTrophy },
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

    pengajuan.forEach((p, idx) => {
      list.push({
        id: `pengajuan-${p.id || idx}`,
        kategori: "kolaborasi",
        judul: `Pengajuan Proyek: ${p.judul}`,
        deskripsi: `Mengirimkan pendaftaran kolaborasi ke ${p.perusahaan} dengan status '${p.status}'.`,
        waktu: p.tanggal || "Terbaru",
        badgeText: "Kolaborasi",
        badgeColor: "bg-sky/15 text-ocean border-sky/40",
      });
    });

    if (user?.skills && user.skills.length > 0) {
      list.push({
        id: "act-skills",
        kategori: "skill",
        judul: "Pembaruan Skill & Portofolio",
        deskripsi: `Keahlian terdaftar: ${user.skills.slice(0, 4).join(", ")}${user.skills.length > 4 ? "..." : ""}.`,
        waktu: "Terdaftar",
        badgeText: "Skill & Tools",
        badgeColor: "bg-sky/15 text-ocean border-sky/40",
      });
    }

    if (totalPengajuan > 0) {
      list.push({
        id: "act-badge",
        kategori: "pencapaian",
        judul: "Level & Pencapaian Kolaborasi",
        deskripsi: `Aktif berpartisipasi dengan total ${totalPengajuan} pengajuan kolaborasi terverifikasi.`,
        waktu: "Aktif",
        badgeText: "Pencapaian",
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
  }, [pengajuan, user?.skills, totalPengajuan]);

  const filteredActivities = useMemo(() => {
    if (filter === "semua") return rawActivities;
    return rawActivities.filter((a) => a.kategori === filter);
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
/* Main Profile Page Component                                        */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [fileError, setFileError] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [tabDirection, setTabDirection] = useState(1);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [dbBadges, setDbBadges] = useState<DbBadge[]>([]);
  const [badgePage, setBadgePage] = useState(1);

  // tracks badges seen so far in THIS session only (in-memory, not persisted)
  const seenBadgeIdsRef = useRef<Set<string> | null>(null);
  const [freshBadgeIds, setFreshBadgeIds] = useState<Set<string>>(new Set());

  const [userMetrics, setUserMetrics] = useState({
    xp: 0,
    streakCount: 0,
    reputationScore: 0,
    responseRate: 0,
  });

  const [loadError, setLoadError] = useState("");

  const loadFromDatabase = async () => {
    setLoadError("");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsLoadingUser(false);
      return; // ini beneran belum login
    }

    const res = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setLoadError(body.error || `Gagal memuat profil (${res.status})`);
      setIsLoadingUser(false);
      return;
    }

    const data = await res.json();
    console.log("🚀 [DEBUG Client Profile] GET /api/me response:", data);

    const parsed: StoredUser = {
      nama: data.nama,
      email: data.email,
      universitas: data.universitas,
      prodi: data.prodi,
      semester: data.semester,
      minatKategori: data.minatKategori,
      skills: data.skills,
      preferensiTipe: data.preferensiTipe,
      preferensiLokasi: data.preferensiLokasi,
      ringkasan: data.ringkasanSelf,
      foto: data.fotoUrl,
    };
    setUser(parsed);
    setUserMetrics({
      xp: data.xp ?? 0,
      streakCount: data.streakCount ?? 0,
      reputationScore: data.reputationScore ?? 0,
      responseRate: data.responseRate ?? 0,
    });
    if (Array.isArray(data.badges)) {
      console.log("🚀 [DEBUG Client Profile] Setting dbBadges from API:", data.badges.length, "items");
      setDbBadges(data.badges);
    } else {
      console.log("🚀 [DEBUG Client Profile] data.badges is NOT an array or missing:", data.badges);
    }

    let currentPengajuan: Pengajuan[] = Array.isArray(data.pengajuan) ? data.pengajuan : [];
    console.log("🚀 [DEBUG Client Profile] API returned pengajuan count:", currentPengajuan.length);

    // Jika dari API me kosong, coba query langsung supabase client dengan auth.getUser()
    if (currentPengajuan.length === 0) {
      const { data: authUser } = await supabase.auth.getUser();
      console.log("🚀 [DEBUG Client Profile] Querying direct Supabase for user:", authUser?.user?.id);
      if (authUser?.user?.id) {
        const { data: dbData, error: dbErr } = await supabase
          .from("pendaftaran_kolaborasi")
          .select("id, status, tanggal_daftar, kolaborasi:kolaborasi_id(judul, perusahaan:perusahaan_id(nama_perusahaan))")
          .eq("mahasiswa_id", authUser.user.id);

        console.log("🚀 [DEBUG Client Profile] Direct Supabase count:", dbData?.length ?? 0, "Err:", dbErr?.message);

        if (dbData && dbData.length > 0) {
          currentPengajuan = dbData.map((item: any) => ({
            id: item.id,
            judul: item.kolaborasi?.judul ?? "Pengajuan Kolaborasi",
            perusahaan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
            status: item.status ?? "Menunggu",
            tujuan: item.kolaborasi?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
            tanggal: item.tanggal_daftar
              ? new Date(item.tanggal_daftar).toLocaleDateString("id-ID")
              : "-",
          }));
        }
      }
    }

    // Jika masih 0 (misalnya registrasi lokal tanpa DB pendaftaran), ambil dari localStorage bridgeu_pengajuan
    if (currentPengajuan.length === 0) {
      const stored = localStorage.getItem("bridgeu_pengajuan");
      console.log("🚀 [DEBUG Client Profile] Checking localStorage bridgeu_pengajuan:", stored);
      if (stored) {
        try {
          const parsedLocal = JSON.parse(stored);
          if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
            currentPengajuan = parsedLocal.map((item: any) => ({
              id: item.id || `local-${Math.random()}`,
              judul: item.judul || "Proyek Kolaborasi",
              perusahaan: item.perusahaan || "Mitra Perusahaan",
              status: item.status || "Menunggu",
              tujuan: item.perusahaan || "Mitra Perusahaan",
              tanggal: item.tanggal || "Terbaru",
            }));
          }
        } catch {
          // ignore
        }
      }
    }

    console.log("🚀 [DEBUG Client Profile] FINAL pengajuan state count:", currentPengajuan.length);
    setPengajuan(currentPengajuan);
    setIsLoadingUser(false);
    if (!data.universitas || !data.prodi) {
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    loadFromDatabase();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleTabChange = (key: TabKey) => {
    const oldIndex = TABS.findIndex((t) => t.key === activeTab);
    const newIndex = TABS.findIndex((t) => t.key === key);
    setTabDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(key);
  };

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("File harus berupa gambar (JPG, PNG).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran gambar maksimal 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.onerror = () => setFileError("Gagal membaca file gambar.");
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const saveToDatabase = async (payload: Record<string, any>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { ok: false, error: "Sesi login habis, silakan login ulang." };

    const res = await fetch("/api/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, error: body.error || `Gagal menyimpan (${res.status})` };
    }
    return { ok: true, error: "" };
  };

  const handlePhotoSave = async (dataUrl: string) => {
    if (!user) return;
    const updated: StoredUser = { ...user, foto: dataUrl };
    const result = await saveToDatabase({ fotoUrl: dataUrl });
    if (!result.ok) {
      setFileError(result.error);
      return;
    }
    setUser(updated);
    setPendingImage(null);
    setShowSuccessModal(true);
  };

  const handleProfileDataSave = async (updated: StoredUser) => {
    if (isEditSaving) return; // cegah submit dobel selagi masih proses
    setIsEditSaving(true);
    const result = await saveToDatabase({
      nama: updated.nama,
      universitas: updated.universitas,
      prodi: updated.prodi,
      semester: updated.semester,
      preferensiTipe: updated.preferensiTipe,
      preferensiLokasi: updated.preferensiLokasi,
      ringkasan: updated.ringkasan,
      minatKategori: updated.minatKategori,
      skills: updated.skills,
    });
    setIsEditSaving(false);
    if (!result.ok) {
      setFileError(result.error);
      return;
    }
    setUser(updated);
    setIsEditModalOpen(false);
    setShowSuccessModal(true);
  };

  const totalPengajuan = pengajuan.length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima" || p.status === "Selesai").length;
  const gMetrics = getGamificationMetrics(userMetrics.xp);
  const level = gMetrics.level;
  const earnedBadges = badgeList.filter((b) => b.check(totalPengajuan, diterima));
  const lockedBadges = badgeList.filter((b) => !b.check(totalPengajuan, diterima));

  const [activePopupBadge, setActivePopupBadge] = useState<DbBadge | null>(null);

  // Badge unlock detection for DB Badges
  useEffect(() => {
    if (!dbBadges || dbBadges.length === 0) return;

    const unlockedDbBadges = dbBadges.filter((b) => b.isUnlocked);
    const currentUnlockedIds = new Set(unlockedDbBadges.map((b) => b.id));

    if (seenBadgeIdsRef.current === null) {
      // Sesi pertama: simpan semua ID badge unlocked yang sudah ada
      seenBadgeIdsRef.current = new Set(Array.from(currentUnlockedIds).map(String));
      return;
    }

    // Cari badge baru yang baru saja terbuka
    const newlyUnlockedBadge = unlockedDbBadges.find(
      (b) => !seenBadgeIdsRef.current!.has(String(b.id))
    );

    if (newlyUnlockedBadge) {
      setActivePopupBadge(newlyUnlockedBadge);
      seenBadgeIdsRef.current.add(String(newlyUnlockedBadge.id));
    }
  }, [dbBadges]);

  const skillsList = user?.skills || [];
  const minatList = user?.minatKategori || [];

  const animatedSkillsCount = useSpringNumber(skillsList.length);
  const animatedMinatCount = useSpringNumber(minatList.length);

  if (isLoadingUser) {
    return (
      <main className="min-h-screen bg-clouds pt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-medium text-steel/60">Memuat profil...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-clouds pt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-steel/10 text-steel mb-4 border border-steel/20">
            <IconLock className="w-8 h-8 text-steel" />
          </div>
          <p className="text-sm font-medium text-steel">
            {loadError
              ? `Gagal memuat profil: ${loadError}`
              : "Kamu belum masuk. Silakan masuk terlebih dahulu untuk melihat profil."}
          </p>
        </div>
      </main>
    );
  }

  const inisial = user.nama ? user.nama.trim().charAt(0).toUpperCase() : "?";

  return (
    <main className="min-h-screen bg-clouds text-ink pb-20 overflow-x-visible">
      <AnimatePresence>
        {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
        {activePopupBadge && (
          <BadgeUnlockModal
            badge={activePopupBadge}
            onClose={() => setActivePopupBadge(null)}
          />
        )}
      </AnimatePresence>

      {pendingImage && (
        <EditPhotoModal
          imageSrc={pendingImage}
          onClose={() => setPendingImage(null)}
          onSave={handlePhotoSave}
        />
      )}

      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          isSaving={isEditSaving}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileDataSave}
        />
      )}

      <AnimatePresence>
        {isPhotoOpen && user.foto && (
          <PhotoLightbox src={user.foto} onClose={() => setIsPhotoOpen(false)} />
        )}
      </AnimatePresence>

      {/* Hero Banner Area — ocean → sky gradient, konsisten sama dashboard & kolaborasi */}
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
              <div className="relative group shrink-0">
                <div
                  onClick={() => user.foto && setIsPhotoOpen(true)}
                  className={`h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-clouds bg-card shadow-lg transition-transform duration-200 group-hover:scale-105 ${
                    user.foto ? "cursor-zoom-in" : ""
                  }`}
                >
                  {user.foto ? (
                    <motion.img
                      layoutId="profile-avatar-photo"
                      src={user.foto}
                      alt="Foto profil"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-4xl sm:text-5xl font-bold text-steel/70">
                      {inisial}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fotoInputRef.current?.click()}
                  aria-label="Edit foto profil"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-clouds bg-ink text-paper shadow-md transition hover:scale-110 active:scale-90"
                >
                  <IconCamera className="w-4 h-4 text-sky" />
                </button>
                <input ref={fotoInputRef} type="file" accept="image/*" onChange={readFile} className="hidden" />
              </div>

              <div className="mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                  <RevealText>{user.nama || "Nama Kamu"}</RevealText>
                </h2>
                <p className="text-xs sm:text-sm font-medium text-steel mt-0.5">
                  {[user.prodi, user.universitas].filter(Boolean).join(" • ") || user.email}
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

            <div className="flex items-center gap-3 mb-2 z-10 shrink-0 min-h-[42px]">
              {activeTab === "profile" && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-paper transition-colors flex items-center gap-2 active:scale-95"
                >
                  <IconPencil className="w-4 h-4 text-sky" />
                  Edit Profil
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-ink transition-colors flex items-center gap-2 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 active:scale-95"
              >
                <IconLogout className="w-4 h-4 text-steel" />
                Keluar
              </button>
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
        {fileError && (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in duration-200">
            <IconAlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Sidebar — cards get a subtle micro-nudge replay on tab change */}
          <div className="lg:col-span-4 space-y-6">
            <RevealCard nudgeKey={`bio-${activeTab}`} delay={0} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconFileText className="w-4 h-4 text-ink/60" />
                Bio & Ringkasan Diri
              </h3>
              <p className="text-xs leading-relaxed text-steel">
                {user.ringkasan || "Belum ada ringkasan atau deskripsi diri yang ditambahkan."}
              </p>
            </RevealCard>

            <RevealCard nudgeKey={`info-${activeTab}`} delay={0.03} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                <IconPin className="w-4 h-4 text-ink/60" />
                Informasi & Sistem Kerja
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Universitas", value: user.universitas || "—", icon: IconUser },
                  { label: "Program Studi", value: user.prodi || "—", icon: IconClipboard },
                  {
                    label: "Semester",
                    value: user.semester
                      ? user.semester.toString().toLowerCase().includes("semester")
                        ? user.semester
                        : `Semester ${user.semester}`
                      : "—",
                    icon: IconTarget,
                  },
                  { label: "Tipe Kolaborasi", value: user.preferensiTipe || "Semua", icon: IconRocket },
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
                  <p className="text-xs font-bold text-ink">{user.preferensiLokasi || "Remote"}</p>
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
                  skillsList.map((s) => (
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
                  minatList.map((m) => (
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
              <LevelGamificationCard totalXp={userMetrics.xp} />
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
                          <InfoField label="Nama Lengkap" value={user.nama} icon={IconUser} />
                          <InfoField label="Email" value={user.email} icon={IconFileText} />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-steel/10 pt-5">
                          <InfoField label="Universitas" value={user.universitas || ""} icon={IconPin} />
                          <InfoField label="Program Studi" value={user.prodi || ""} icon={IconClipboard} />
                          <InfoField
                            label="Semester"
                            value={user.semester ? (user.semester.toString().toLowerCase().includes("semester") ? user.semester : `Semester ${user.semester}`) : ""}
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
                              minatList.map((m) => (
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
                              skillsList.map((s) => (
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
                  {activeTab === "activity" && (
                    <PublicActivitySection
                      user={user}
                      userMetrics={userMetrics}
                      pengajuan={pengajuan}
                    />
                  )}

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
                            Total {dbBadges.length} Badge • {dbBadges.filter(b => b.isUnlocked).length} Unlocked
                          </p>
                        </div>
                      </div>

                      {(() => {
                        const BADGES_PER_PAGE = 10;
                        const totalBadgePages = Math.ceil(dbBadges.length / BADGES_PER_PAGE) || 1;
                        const currentPageBadges = dbBadges.slice((badgePage - 1) * BADGES_PER_PAGE, badgePage * BADGES_PER_PAGE);

                        return (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {currentPageBadges.length > 0
                                ? currentPageBadges.map((b) => (
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
                                            <img src={b.iconUrl} alt={b.namaBadge} className="w-7 h-7 object-contain" />
                                          ) : (
                                            <IconTrophy className={`w-4 h-4 ${b.isUnlocked ? "text-ocean" : "text-steel"}`} />
                                          )}
                                          <p className="text-xs font-bold text-ink">{b.namaBadge}</p>
                                        </div>
                                        {b.isUnlocked && (
                                          <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                            +{b.xpBonus} XP
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
                                  ))
                                : earnedBadges.map((b) => (
                                    <div key={b.id} className="group rounded-xl border border-sky/40 bg-sky/15 p-4">
                                      <p className="text-sm font-bold text-ink flex items-center gap-2">
                                        <IconTrophy className="w-4 h-4 text-ocean" />
                                        {b.nama}
                                      </p>
                                      <p className="mt-2 text-xs text-steel leading-relaxed">{b.deskripsi}</p>
                                      <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-sky/40 px-2 py-0.5 text-[10px] font-bold text-ocean">
                                        <IconCheck className="w-3 h-3 text-ocean" />
                                        Unlocked
                                      </span>
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