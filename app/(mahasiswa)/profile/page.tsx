"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { allCategoriesList, allSkillsList, badgeList } from "@/lib/dummy-data";
import { supabase } from "@/lib/supabase";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* ------------------------------------------------------------------ */
/* SVG Icon Components (Strictly Yellow Icons & Zero Emojis)          */
/* ------------------------------------------------------------------ */

function IconCheck({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconPencil({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconSave({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function IconCamera({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconRotate({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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

function IconLogout({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
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

function IconAlertTriangle({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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
/* Magnetic button — nudges slightly toward the cursor on hover        */
/* ------------------------------------------------------------------ */
function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
  formId,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  formId?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 15 });
  const springY = useSpring(y, { stiffness: 250, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      form={formId}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
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
/* Accepts a `nudgeKey` so callers can force a lightweight replay      */
/* (micro-nudge) of the entrance animation, e.g. on tab switches,      */
/* without treating it as a full first-mount reveal.                   */
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
        <IconX className="w-5 h-5 text-bridge-gold" />
      </button>
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
                  ? `Selesaikan ${xpRemaining} pengajuan proyek lagi untuk naik level berikutnya`
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bridge-gold/15 border border-bridge-gold/30">
          <svg viewBox="0 0 52 52" className="h-10 w-10">
            <circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-bridge-gold animate-draw-circle"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-bridge-gold animate-draw-check"
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
            className="h-full bg-bridge-gold rounded-full"
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
            <IconCamera className="w-4 h-4 text-bridge-gold" />
            Edit Foto Profil
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-steel/70 hover:bg-steel/10 hover:text-steel transition active:scale-90"
          >
            <IconX className="w-4 h-4 text-bridge-gold" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 pt-5">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative overflow-hidden rounded-full border-2 border-steel/20 bg-paper"
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
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-steel/20 accent-bridge-gold transition-all"
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
              <IconRotate className="w-4 h-4 text-bridge-gold" />
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
                <IconCheck className="w-3.5 h-3.5 text-bridge-gold" />
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
/* Modal Edit Data Profil (Single-Scroll Modal)                      */
/* ------------------------------------------------------------------ */
function EditProfileModal({
  user,
  onClose,
  onSave,
}: {
  user: StoredUser;
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

  const toggleMinat = (m: string) => {
    setMinatKategori((prev) => (prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]));
  };

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      nama,
      email,
      universitas,
      prodi,
      semester,
      preferensiTipe,
      preferensiLokasi,
      ringkasan,
      minatKategori,
      skills,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-paper shadow-2xl border border-steel/20 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-steel/10 px-6 py-4 shrink-0">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <IconPencil className="w-4 h-4 text-bridge-gold" />
            Edit Profil Data Diri
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-steel/70 hover:bg-steel/10 hover:text-steel transition active:scale-90"
          >
            <IconX className="w-4 h-4 text-bridge-gold" />
          </button>
        </div>

        <form id="edit-profile-form" onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Universitas</label>
              <input
                type="text"
                value={universitas}
                onChange={(e) => setUniversitas(e.target.value)}
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Program Studi</label>
              <input
                type="text"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-2">Kategori Proyek Minat</label>
            <div className="flex flex-wrap gap-1.5">
              {allCategoriesList.map((m) => {
                const selected = minatKategori.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleMinat(m)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-ink text-paper"
                        : "border border-steel/20 bg-paper text-steel hover:bg-paper"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-2">Skill & Tools</label>
            <div className="flex flex-wrap gap-1.5">
              {allSkillsList.map((s) => {
                const selected = skills.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-bridge-gold/100 text-paper"
                        : "border border-steel/20 bg-paper text-steel hover:bg-paper"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">Preferensi Tipe Kolaborasi</label>
              <select
                value={preferensiTipe}
                onChange={(e) => setPreferensiTipe(e.target.value)}
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
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
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
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
              className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-3.5 py-2 text-xs text-ink outline-none focus:border-ink transition"
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
            <IconSave className="w-4 h-4 text-bridge-gold" />
            Simpan Perubahan
          </button>
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
function PublicActivitySection() {
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
      deskripsi: "Mengajukan kolaborasi Studi Kasus: Optimasi UX Aplikasi Perbankan di Nexora Digital.",
      waktu: "Hari ini, 14:30",
      badgeText: "Kolaborasi",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-2",
      kategori: "skill",
      judul: "Pembaruan Skill & Portofolio",
      deskripsi: "Menambahkan skill baru: TypeScript, React, dan Figma ke profil publik.",
      waktu: "Kemarin, 09:15",
      badgeText: "Skill & Tools",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-3",
      kategori: "pencapaian",
      judul: "Membuka Badge Baru",
      deskripsi: "Berhasil mendapatkan badge 'Consistent Contributor' dari keaktifan kolaborasi.",
      waktu: "3 Hari lalu",
      badgeText: "Pencapaian",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-4",
      kategori: "kolaborasi",
      judul: "Disetujui untuk Magang Frontend",
      deskripsi: "Lamaran magang di Skyline Fintech telah dikonfirmasi dan disetujui.",
      waktu: "5 Hari lalu",
      badgeText: "Kolaborasi",
      badgeColor: "bg-bridge-gold/10 text-bridge-gold border-bridge-gold/30",
    },
    {
      id: "act-5",
      kategori: "skill",
      judul: "Memperbarui Preferensi Kerja",
      deskripsi: "Mengubah preferensi sistem kerja menjadi Remote & Hybrid.",
      waktu: "1 Minggu lalu",
      badgeText: "Profil Update",
      badgeColor: "bg-steel/10 text-ink/80 border-steel/20",
    },
  ];

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
            <p className="text-xs text-steel mt-0.5">Catatan aktivitas harian kamu selama 12 minggu terakhir</p>
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
/* Main Profile Page Component                                        */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fileError, setFileError] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [tabDirection, setTabDirection] = useState(1);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  // tracks badges seen so far in THIS session only (in-memory, not persisted)
  const seenBadgeIdsRef = useRef<Set<string> | null>(null);
  const [freshBadgeIds, setFreshBadgeIds] = useState<Set<string>>(new Set());

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
    setIsLoadingUser(false);
    if (!data.universitas || !data.prodi) {
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    loadFromDatabase();

    const storedPengajuan = localStorage.getItem("bridgeu_pengajuan");
    if (storedPengajuan) {
      try {
        const parsedPengajuan = JSON.parse(storedPengajuan);
        queueMicrotask(() => setPengajuan(parsedPengajuan));
      } catch {
        // ignore
      }
    }
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
  const level = Math.floor(totalPengajuan / 2) + 1;
  const earnedBadges = badgeList.filter((b) => b.check(totalPengajuan, diterima));
  const lockedBadges = badgeList.filter((b) => !b.check(totalPengajuan, diterima));

  // Badge unlock detection — compares against an in-memory snapshot from
  // the first render of this session only. Nothing is written to storage,
  // so this naturally resets on reload/new session (see chat discussion).
  useEffect(() => {
    const currentIds = new Set(earnedBadges.map((b) => b.id));

    if (seenBadgeIdsRef.current === null) {
      // first run this session: treat everything already earned as "old"
      seenBadgeIdsRef.current = currentIds;
      return;
    }

    const newlyUnlocked = new Set<string>();
    currentIds.forEach((id) => {
      if (!seenBadgeIdsRef.current!.has(id)) newlyUnlocked.add(id);
    });

    if (newlyUnlocked.size > 0) {
      setFreshBadgeIds((prev) => new Set([...prev, ...newlyUnlocked]));
      seenBadgeIdsRef.current = currentIds;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPengajuan, diterima]);

  const skillsList = user?.skills || [];
  const minatList = user?.minatKategori || [];

  const animatedSkillsCount = useSpringNumber(skillsList.length);
  const animatedMinatCount = useSpringNumber(minatList.length);

  if (isLoadingUser) {
    return (
      <main className="min-h-screen bg-paper pt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-medium text-steel/60">Memuat profil...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-paper pt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-steel/10 text-steel mb-4 border border-steel/20">
            <IconLock className="w-8 h-8 text-bridge-gold" />
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
    <main className="min-h-screen bg-paper text-ink pt-24 pb-20 overflow-x-visible">
      <AnimatePresence>
        {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
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
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileDataSave}
        />
      )}

      <AnimatePresence>
        {isPhotoOpen && user.foto && (
          <PhotoLightbox src={user.foto} onClose={() => setIsPhotoOpen(false)} />
        )}
      </AnimatePresence>

      {/* Hero Banner Area — pure gradient transition, no curved divider */}
      <div className="-mt-20 w-full bg-paper">
        <div className="w-full bg-gradient-to-b from-ink via-ink/90 to-paper relative pt-24 pb-24 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent)]" />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 relative overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-16 sm:-mt-20 gap-6 pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-20">
              <div className="relative group shrink-0">
                <div
                  onClick={() => user.foto && setIsPhotoOpen(true)}
                  className={`h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-paper bg-steel/10 shadow-lg transition-transform duration-200 group-hover:scale-105 ${
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
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper bg-ink text-paper shadow-md transition hover:scale-110 active:scale-90"
                >
                  <IconCamera className="w-4 h-4 text-bridge-gold" />
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

            <div className="flex items-center gap-3 mb-2 z-10 shrink-0 min-h-[42px]">
              {activeTab === "profile" && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-paper transition-colors flex items-center gap-2 active:scale-95"
                >
                  <IconPencil className="w-4 h-4 text-bridge-gold" />
                  Edit Profil
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-steel/20 bg-paper px-5 py-2.5 text-xs font-bold text-ink transition-colors flex items-center gap-2 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 active:scale-95"
              >
                <IconLogout className="w-4 h-4 text-bridge-gold" />
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
                    className={`relative isolate flex items-center gap-2.5 rounded-xl px-5 py-3 sm:px-6 text-xs sm:text-sm font-bold transition-colors duration-150 active:scale-95 border ${
                      isActive
                        ? "border-ink text-paper"
                        : "border-steel/20 bg-paper text-steel hover:text-ink hover:border-steel/40"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-tab-pill"
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
        {fileError && (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in duration-200">
            <IconAlertTriangle className="w-4 h-4 text-bridge-gold shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Sidebar — cards get a subtle micro-nudge replay on tab change */}
          <div className="lg:col-span-4 space-y-6">
            <RevealCard nudgeKey={`bio-${activeTab}`} delay={0} className="rounded-2xl border border-steel/20 bg-paper p-5">
              <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <IconFileText className="w-4 h-4 text-bridge-gold" />
                Bio & Ringkasan Diri
              </h3>
              <p className="text-xs leading-relaxed text-steel">
                {user.ringkasan || "Belum ada ringkasan atau deskripsi diri yang ditambahkan."}
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
                  <span className="font-semibold text-ink">{user.universitas || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Program Studi</span>
                  <span className="font-semibold text-ink">{user.prodi || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Semester</span>
                  <span className="font-semibold text-ink">{user.semester ? `Semester ${user.semester}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-steel/10 pb-2.5">
                  <span className="text-steel/70 font-medium">Tipe Kolaborasi</span>
                  <span className="font-semibold text-ink">{user.preferensiTipe || "Semua"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-steel/70 font-medium">Sistem Kerja</span>
                  <span className="font-semibold text-ink">{user.preferensiLokasi || "Remote"}</span>
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
                          <InfoField label="Nama Lengkap" value={user.nama} />
                          <InfoField label="Email" value={user.email} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-steel/10 pt-5">
                          <InfoField label="Universitas" value={user.universitas || ""} />
                          <InfoField label="Program Studi" value={user.prodi || ""} />
                          <InfoField label="Semester" value={user.semester || ""} />
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
                  {activeTab === "activity" && <PublicActivitySection />}

                  {/* TAB 3: PENCAPAIAN */}
                  {activeTab === "pencapaian" && (
                    <div className="rounded-2xl border border-steel/20 bg-paper p-6 sm:p-8">
                      <h3 className="text-base font-bold text-ink border-b border-steel/10 pb-4 mb-6 flex items-center gap-2">
                        <IconTrophy className="w-5 h-5 text-bridge-gold" />
                        Pencapaian & Badge Profil
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {earnedBadges.map((b) => {
                          const isFresh = freshBadgeIds.has(b.id);
                          return (
                            <motion.div
                              key={b.id}
                              initial={isFresh ? { opacity: 0, scale: 0.6 } : false}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={
                                isFresh
                                  ? { type: "spring", stiffness: 300, damping: 14 }
                                  : { duration: 0 }
                              }
                              onAnimationComplete={() => {
                                if (isFresh) {
                                  setFreshBadgeIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(b.id);
                                    return next;
                                  });
                                }
                              }}
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
                            </motion.div>
                          );
                        })}
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
                                <p className="text-sm font-bold text-ink">{p.judul}</p>
                                <p className="text-xs text-steel">{p.perusahaan} • {p.tanggal}</p>
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