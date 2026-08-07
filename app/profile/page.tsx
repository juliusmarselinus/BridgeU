"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { allCategoriesList, allSkillsList, badgeList } from "@/lib/dummy-data";

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

function IconCheck({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconPencil({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconSave({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function IconCamera({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconRotate({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconTrophy({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
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

function IconRocket({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5l-3-3c-1 0-1.79.79-1.5 2.5z" />
      <path d="M12 15l-3-3 8.5-8.5c1.2-1.2 3.1-1.2 4.3 0s1.2 3.1 0 4.3L12 15z" />
      <path d="M9 18l3 3" />
    </svg>
  );
}

function IconActivity({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconFileText({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconPin({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.5-6h1.5V5H3v6h1.5L5 17z" />
    </svg>
  );
}

function IconClipboard({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconTarget({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconWrench({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconLock({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconFlame({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.99-1.25-3.32-2.5-4.5-1.25 1.18-2.5 2.51-2.5 4.5z" />
      <path d="M12 2c1.72 2.76 4.5 4.2 4.5 8.5a6.5 6.5 0 1 1-13 0c0-4.3 2.78-5.74 4.5-8.5 1.25 2.5 2.75 3.5 4 0z" />
    </svg>
  );
}

function IconAlertTriangle({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconChartLine({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconChartBar({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function IconChartPie({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function IconCheckSquare({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconSparkles({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Micro Interaction Counter Hook                                     */
/* ------------------------------------------------------------------ */
function useAnimatedNumber(target: number, duration: number = 600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const steps = 24;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

/* ------------------------------------------------------------------ */
/* Minimal Border-based Level Gamification Progress Bar Component      */
/* ------------------------------------------------------------------ */
function LevelGamificationCard({ level, totalPengajuan }: { level: number; totalPengajuan: number }) {
  const animatedLevel = useAnimatedNumber(level);
  
  const xpCurrent = totalPengajuan % 2;
  const xpNext = 2;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNext) * 100));
  const xpRemaining = xpNext - xpCurrent;

  let levelTitle = "Novice Explorer";
  if (level === 2) levelTitle = "Active Collaborator";
  if (level === 3) levelTitle = "Project Master";
  if (level >= 4) levelTitle = "Elite Architect";

  return (
    <div className="relative group cursor-pointer overflow-visible z-30 w-full">
      {/* Minimal Border-based Status Bar */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-amber-400">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Level Icon & Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 text-amber-600">
              <IconTrophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black text-slate-900">
                  Level {animatedLevel}
                </span>
                <span className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                  {levelTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {xpRemaining > 0
                  ? `Selesaikan ${xpRemaining} pengajuan proyek lagi untuk naik level berikutnya`
                  : "Siap naik ke level berikutnya!"}
              </p>
            </div>
          </div>

          {/* Right: XP Progress Bar & Counter */}
          <div className="w-full md:w-72 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
              <span>Progres Gamifikasi</span>
              <span className="text-amber-600 font-mono">{xpCurrent}/{xpNext} XP ({xpPercent}%)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Level Tooltip Modal on Hover (Overflow Allowed) */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 rounded-2xl border border-amber-200 bg-white p-4.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5 mb-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
            <IconTrophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Tingkat Level Gamifikasi</h4>
            <p className="text-[10px] text-amber-600 font-bold">{levelTitle} (Lvl {level})</p>
          </div>
        </div>

        {/* Progress Bar in Hover Modal */}
        <div className="mb-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
          <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-1">
            <span>Progres Ke Level {level + 1}</span>
            <span className="text-amber-600 font-mono">{xpPercent}% XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 leading-tight">
            {xpRemaining > 0
              ? `Butuh ${xpRemaining} pengajuan kolaborasi lagi untuk naik level.`
              : "Siap naik ke level berikutnya!"}
          </p>
        </div>

        {/* Gamification Levels List */}
        <div className="space-y-1.5 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hierarki Level:</p>
          
          <div className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-colors ${level === 1 ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <span className="flex items-center gap-1.5">
              <IconTrophy className="w-3.5 h-3.5 text-amber-500" />
              Lvl 1: Novice Explorer
            </span>
            <span className="text-[10px] font-mono font-semibold">0-1 Proyek</span>
          </div>

          <div className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-colors ${level === 2 ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <span className="flex items-center gap-1.5">
              <IconTrophy className="w-3.5 h-3.5 text-amber-500" />
              Lvl 2: Active Collaborator
            </span>
            <span className="text-[10px] font-mono font-semibold">2-3 Proyek</span>
          </div>

          <div className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-colors ${level === 3 ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <span className="flex items-center gap-1.5">
              <IconTrophy className="w-3.5 h-3.5 text-amber-500" />
              Lvl 3: Project Master
            </span>
            <span className="text-[10px] font-mono font-semibold">4-5 Proyek</span>
          </div>

          <div className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-colors ${level >= 4 ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <span className="flex items-center gap-1.5">
              <IconTrophy className="w-3.5 h-3.5 text-amber-500" />
              Lvl 4+: Elite Architect
            </span>
            <span className="text-[10px] font-mono font-semibold">6+ Proyek</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal Success Animated Pop-up                                       */
/* ------------------------------------------------------------------ */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-500 mb-4 border border-amber-200">
          <IconCheck className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Berhasil Disimpan!</h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Perubahan profil kamu telah diperbarui dan siap ditampilkan.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <IconCheck className="w-4 h-4 text-amber-400" />
          Mantap, Siap!
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal Edit Photo                                                   */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <IconCamera className="w-4 h-4 text-amber-500" />
            Edit Foto Profil
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition active:scale-90"
          >
            <IconX className="w-4 h-4 text-amber-500" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 pt-5">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50"
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
            <span className="text-xs font-bold text-slate-400">−</span>
            <input
              type="range"
              min={50}
              max={200}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-amber-500 transition-all"
            />
            <span className="text-xs font-bold text-slate-400">+</span>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-slate-500">{zoom}%</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handleRotate}
              aria-label="Putar gambar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 active:scale-90"
            >
              <IconRotate className="w-4 h-4 text-amber-500" />
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition active:scale-95 flex items-center gap-1.5"
              >
                <IconCheck className="w-3.5 h-3.5 text-amber-400" />
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
/* Helper Component                                                   */
/* ------------------------------------------------------------------ */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-xl p-2.5 transition duration-150 hover:bg-slate-50">
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public Activity Section Component                                   */
/* ------------------------------------------------------------------ */
function PublicActivitySection() {
  const [filter, setFilter] = useState<"semua" | "kolaborasi" | "skill" | "pencapaian">("semua");

  // Activity Heatmap data (12 weeks * 7 days = 84 days)
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

  const rawActivities = [
    {
      id: "act-1",
      kategori: "kolaborasi",
      judul: "Pengajuan Lamaran Proyek",
      deskripsi: "Mengajukan kolaborasi Studi Kasus: Optimasi UX Aplikasi Perbankan di Nexora Digital.",
      waktu: "Hari ini, 14:30",
      badgeText: "Kolaborasi",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "act-2",
      kategori: "skill",
      judul: "Pembaruan Skill & Portofolio",
      deskripsi: "Menambahkan skill baru: TypeScript, React, dan Figma ke profil publik.",
      waktu: "Kemarin, 09:15",
      badgeText: "Skill & Tools",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "act-3",
      kategori: "pencapaian",
      judul: "Membuka Badge Baru",
      deskripsi: "Berhasil mendapatkan badge 'Consistent Contributor' dari keaktifan kolaborasi.",
      waktu: "3 Hari lalu",
      badgeText: "Pencapaian",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "act-4",
      kategori: "kolaborasi",
      judul: "Disetujui untuk Magang Frontend",
      deskripsi: "Lamaran magang di Skyline Fintech telah dikonfirmasi dan disetujui.",
      waktu: "5 Hari lalu",
      badgeText: "Kolaborasi",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "act-5",
      kategori: "skill",
      judul: "Memperbarui Preferensi Kerja",
      deskripsi: "Mengubah preferensi sistem kerja menjadi Remote & Hybrid.",
      waktu: "1 Minggu lalu",
      badgeText: "Profil Update",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    },
  ];

  const filteredActivities = useMemo(() => {
    if (filter === "semua") return rawActivities;
    return rawActivities.filter((a) => a.kategori === filter);
  }, [filter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Stats Line */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Kontribusi</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
              <IconActivity className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">38 <span className="text-xs font-semibold text-amber-600">+12%</span></p>
          <p className="text-[11px] text-slate-400 mt-1">Aksi publik dalam 30 hari</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Streak Keaktifan</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
              <IconFlame className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">14 Hari</p>
          <p className="text-[11px] text-slate-400 mt-1">Aktif berturut-turut</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Reputasi Publik</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
              <IconTrophy className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">480 <span className="text-xs font-normal text-slate-400">Pts</span></p>
          <p className="text-[11px] text-slate-400 mt-1">Top 5% Mahasiswa Aktif</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Respon Rate</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500 border border-amber-200">
              <IconCheckSquare className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">98%</p>
          <p className="text-[11px] text-slate-400 mt-1">Respon komunikasi cepat</p>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <IconActivity className="w-5 h-5 text-amber-500" />
              Matriks Keaktifan Publik
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Catatan aktivitas harian kamu selama 12 minggu terakhir</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Kurang</span>
            <span className="h-3 w-3 rounded-xs bg-slate-100 inline-block" />
            <span className="h-3 w-3 rounded-xs bg-amber-200 inline-block" />
            <span className="h-3 w-3 rounded-xs bg-amber-400 inline-block" />
            <span className="h-3 w-3 rounded-xs bg-amber-500 inline-block" />
            <span>Banyak</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[640px]">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5">
              {heatmapDays.map((item, idx) => {
                let colorClass = "bg-slate-100 hover:bg-slate-200";
                if (item.count === 1) colorClass = "bg-amber-200 hover:bg-amber-300";
                if (item.count === 2) colorClass = "bg-amber-400 hover:bg-amber-500";
                if (item.count >= 3) colorClass = "bg-amber-500 hover:bg-amber-600";

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

      {/* Activity Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <IconRocket className="w-5 h-5 text-amber-500" />
            Riwayat Aktivitas Publik
          </h3>

          {/* Filter Pills */}
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
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative group transition-all duration-150">
              <span className="absolute -left-[19px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-amber-400 ring-2 ring-amber-100 group-hover:scale-125 transition-transform" />
              <div className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${act.badgeColor}`}>
                      {act.badgeText}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{act.judul}</h4>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 shrink-0">{act.waktu}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{act.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Profile Page Component                                        */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fileError, setFileError] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "activity" | "pencapaian" | "pengajuan">("profile");
  const fotoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [preferensiTipe, setPreferensiTipe] = useState("Semua");
  const [preferensiLokasi, setPreferensiLokasi] = useState("Remote");
  const [ringkasan, setRingkasan] = useState("");
  const [foto, setFoto] = useState("");
  const [minatKategori, setMinatKategori] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  const loadFromStorage = () => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) {
      const parsed: StoredUser = JSON.parse(stored);
      setUser(parsed);
      setNama(parsed.nama || "");
      setEmail(parsed.email || "");
      setUniversitas(parsed.universitas || "");
      setProdi(parsed.prodi || "");
      setSemester(parsed.semester || "");
      setPreferensiTipe(parsed.preferensiTipe || "Semua");
      setPreferensiLokasi(parsed.preferensiLokasi || "Remote");
      setRingkasan(parsed.ringkasan || "");
      setFoto(parsed.foto || "");
      setMinatKategori(parsed.minatKategori || []);
      setSkills(parsed.skills || []);
    }
  };

  useEffect(() => {
    loadFromStorage();

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

  const toggleMinat = (m: string) => {
    setMinatKategori((prev) => (prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]));
  };

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]));
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

  const handleModalSave = (dataUrl: string) => {
    setFoto(dataUrl);
    setPendingImage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoredUser = {
      ...user,
      nama,
      email,
      universitas,
      prodi,
      semester,
      preferensiTipe,
      preferensiLokasi,
      ringkasan,
      foto,
      minatKategori,
      skills,
    } as StoredUser;

    localStorage.setItem("bridgeu_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("bridgeu_user_updated"));
    setUser(updated);
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    loadFromStorage();
    setIsEditing(false);
    setFileError("");
  };

  const totalPengajuan = pengajuan.length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima" || p.status === "Selesai").length;
  const level = Math.floor(totalPengajuan / 2) + 1;
  const earnedBadges = badgeList.filter((b) => b.check(totalPengajuan, diterima));
  const lockedBadges = badgeList.filter((b) => !b.check(totalPengajuan, diterima));

  // Micro-interaction counters
  const animatedSkillsCount = useAnimatedNumber(skills.length);
  const animatedMinatCount = useAnimatedNumber(minatKategori.length);

  if (!user) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4 border border-slate-200">
            <IconLock className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            Kamu belum masuk. Silakan masuk terlebih dahulu untuk melihat profil.
          </p>
        </div>
      </main>
    );
  }

  const inisial = nama ? nama.trim().charAt(0).toUpperCase() : "?";

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20 overflow-x-visible">
      {/* Sticky Floating Navbar (Stays sticky when scrolling down the page) */}
      <Navbar />

      {/* Pop-up Modal Sukses */}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

      {/* Modal Edit Foto */}
      {pendingImage && (
        <EditPhotoModal
          imageSrc={pendingImage}
          onClose={() => setPendingImage(null)}
          onSave={handleModalSave}
        />
      )}

      {/* 100% Full-Width Top Section (Cover Banner extends under floating Navbar with zero gap) */}
      <div className="-mt-20 w-full border-b border-slate-200 bg-white">
        {/* Full-width Hero Cover Banner */}
        <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 relative pt-24 pb-20 sm:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent)]" />
        </div>

        {/* Inner Content Container for Profile Header Bar */}
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12 relative overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between relative -mt-16 sm:-mt-20 gap-6 pb-4">
            
            {/* Left/Center Profile Avatar & Name Block */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left z-20">
              <div className="relative group shrink-0">
                <div className="h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md transition-transform duration-200 group-hover:scale-105">
                  {foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={foto} alt="Foto profil" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-4xl sm:text-5xl font-bold text-slate-400">
                      {inisial}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fotoInputRef.current?.click()}
                      aria-label="Edit foto"
                      className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-md transition hover:scale-110 active:scale-90"
                    >
                      <IconPencil className="w-4 h-4 text-amber-400" />
                    </button>
                    <input ref={fotoInputRef} type="file" accept="image/*" onChange={readFile} className="hidden" />
                  </>
                )}
              </div>

              <div className="mb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{nama || "Nama Kamu"}</h2>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  {[prodi, universitas].filter(Boolean).join(" • ") || email}
                </p>
                
                {/* Quick Profile Stat Badges */}
                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 border border-amber-300 flex items-center gap-1.5">
                    <IconTrophy className="w-3.5 h-3.5 text-amber-600" />
                    Lvl {level} Mahasiswa Aktif
                  </span>
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                    {animatedSkillsCount} Skills
                  </span>
                  <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                    {animatedMinatCount} Minat
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 mb-2 z-10 shrink-0">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95 flex items-center gap-2"
                >
                  <IconPencil className="w-4 h-4 text-amber-400" />
                  Edit Profil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95 flex items-center gap-2"
                  >
                    <IconSave className="w-4 h-4 text-amber-400" />
                    Simpan
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Horizontal Navigation Tab Bar */}
          <div className="flex justify-start overflow-x-auto pt-3 pb-3">
            <div className="flex gap-4 sm:gap-6 border-b border-transparent">
              {[
                { key: "profile", label: "Detail Profil", icon: IconUser },
                { key: "activity", label: "Aktivitas Publik", icon: IconActivity },
                { key: "pencapaian", label: "Pencapaian", icon: IconTrophy },
                { key: "pengajuan", label: "Status Kolaborasi", icon: IconRocket },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2.5 rounded-xl px-5 py-3 sm:px-6 py-3 text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 border ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <IconComp className="w-4 h-4 text-amber-400" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Body Layout Container */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-8 lg:px-12 overflow-visible">
        {fileError && (
          <div className="mb-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in duration-200">
            <IconAlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        <form id="profile-form-body" onSubmit={handleSave} className="overflow-visible space-y-6">
          {/* Border-based 2-Column Desktop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Intro Bio */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <IconFileText className="w-4 h-4 text-amber-500" />
                  Bio & Ringkasan Diri
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {ringkasan || "Belum ada ringkasan atau deskripsi diri yang ditambahkan."}
                </p>
              </div>

              {/* Education & Work Preference */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <IconPin className="w-4 h-4 text-amber-500" />
                  Informasi & Sistem Kerja
                </h3>
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400 font-medium">Universitas</span>
                    <span className="font-semibold text-slate-900">{universitas || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400 font-medium">Program Studi</span>
                    <span className="font-semibold text-slate-900">{prodi || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400 font-medium">Semester</span>
                    <span className="font-semibold text-slate-900">{semester ? `Semester ${semester}` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400 font-medium">Tipe Kolaborasi</span>
                    <span className="font-semibold text-slate-900">{preferensiTipe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Sistem Kerja</span>
                    <span className="font-semibold text-slate-900">{preferensiLokasi}</span>
                  </div>
                </div>
              </div>

              {/* Skills Sidebar Badge List */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <IconWrench className="w-4 h-4 text-amber-500" />
                  Skill & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.length > 0 ? (
                    skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Belum ada skill ditambahkan.</p>
                  )}
                </div>
              </div>

              {/* Minat Categories Sidebar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <IconTarget className="w-4 h-4 text-amber-500" />
                  Kategori Minat
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {minatKategori.length > 0 ? (
                    minatKategori.map((m) => (
                      <span
                        key={m}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <IconCheck className="w-3 h-3 text-amber-500" />
                        {m}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Belum ada minat dipilih.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Main Content Feed */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Featured Level Gamification Status Bar */}
              <div className="z-30 relative overflow-visible">
                <LevelGamificationCard level={level} totalPengajuan={totalPengajuan} />
              </div>

              {/* TAB 1: DETAIL PROFIL / EDIT FORM */}
              {activeTab === "profile" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 animate-in fade-in duration-200">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <IconPencil className="w-4 h-4 text-amber-500" />
                        Edit Informasi Akun
                      </>
                    ) : (
                      <>
                        <IconClipboard className="w-4 h-4 text-amber-500" />
                        Informasi Akun Lengkap
                      </>
                    )}
                  </h3>

                  {!isEditing ? (
                    /* VIEW MODE */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <InfoField label="Nama Lengkap" value={nama} />
                        <InfoField label="Email" value={email} />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-slate-100 pt-5">
                        <InfoField label="Universitas" value={universitas} />
                        <InfoField label="Program Studi" value={prodi} />
                        <InfoField label="Semester" value={semester} />
                      </div>

                      <div className="border-t border-slate-100 pt-5">
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                          <IconTarget className="w-3.5 h-3.5 text-amber-500" />
                          Kategori Proyek Minat
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {minatKategori.length > 0 ? (
                            minatKategori.map((m) => (
                              <span
                                key={m}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-1.5"
                              >
                                <IconCheck className="w-3 h-3 text-amber-500" />
                                {m}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400">Belum ada minat dipilih.</p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-5">
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                          <IconWrench className="w-3.5 h-3.5 text-amber-500" />
                          Skill & Tools
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {skills.length > 0 ? (
                            skills.map((s) => (
                              <span
                                key={s}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400">Belum ada skill ditambahkan.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* EDIT MODE */
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Nama Lengkap</label>
                          <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Universitas</label>
                          <input
                            type="text"
                            value={universitas}
                            onChange={(e) => setUniversitas(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Program Studi</label>
                          <input
                            type="text"
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Semester</label>
                          <input
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">Kategori Proyek Minat</label>
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
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                        <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">Skill & Tools</label>
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
                                    ? "bg-amber-500 text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Preferensi Tipe Kolaborasi</label>
                          <select
                            value={preferensiTipe}
                            onChange={(e) => setPreferensiTipe(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          >
                            <option value="Semua">Semua</option>
                            <option value="Akademik">Hanya Studi Kasus / Riset</option>
                            <option value="Magang">Hanya Magang</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Preferensi Sistem Kerja</label>
                          <select
                            value={preferensiLokasi}
                            onChange={(e) => setPreferensiLokasi(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                          >
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Onsite">Onsite</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Ringkasan Pengalaman & Motivasi</label>
                        <textarea
                          rows={3}
                          value={ringkasan}
                          onChange={(e) => setRingkasan(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AKTIVITAS PUBLIK */}
              {activeTab === "activity" && <PublicActivitySection />}

              {/* TAB 3: PENCAPAIAN & BADGE */}
              {activeTab === "pencapaian" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 animate-in fade-in duration-200">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                    <IconTrophy className="w-5 h-5 text-amber-500" />
                    Pencapaian & Badge Profil
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {earnedBadges.map((b) => (
                      <div
                        key={b.id}
                        className="group rounded-xl border border-amber-200 bg-amber-50/50 p-4 transition-all duration-200 hover:border-amber-300"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <IconTrophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                            {b.nama}
                          </p>
                          <IconSparkles className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{b.deskripsi}</p>
                        <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          <IconCheck className="w-3 h-3 text-amber-700" />
                          Unlocked
                        </span>
                      </div>
                    ))}
                    {lockedBadges.map((b) => (
                      <div key={b.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60">
                        <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                          <IconLock className="w-4 h-4 text-amber-400" />
                          {b.nama}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">{b.deskripsi}</p>
                        <span className="mt-3 inline-block rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          Terkunci
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: STATUS KOLABORASI */}
              {activeTab === "pengajuan" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <IconRocket className="w-5 h-5 text-amber-500" />
                      Riwayat Kolaborasi
                    </h3>
                    <Link href="/kolaborasi" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                      Cari Peluang →
                    </Link>
                  </div>

                  {pengajuan.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {pengajuan.map((p) => (
                        <div key={p.id} className="py-4 flex items-center justify-between hover:bg-slate-50 px-3 rounded-xl transition">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{p.judul}</p>
                            <p className="text-xs text-slate-500">{p.perusahaan} • {p.tanggal}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-8">Belum ada riwayat kolaborasi.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </form>
      </div>
    </main>
  );
}