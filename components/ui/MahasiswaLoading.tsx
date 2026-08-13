"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────
   Shared Animated Progress Bar
───────────────────────────────────────────── */
function LoadingProgressBar({ color = "#12284B" }: { color?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress: cepat dulu lalu melambat mendekati 95%
    const timings = [
      { target: 30, duration: 400 },
      { target: 60, duration: 600 },
      { target: 80, duration: 800 },
      { target: 92, duration: 1000 },
      { target: 96, duration: 1500 },
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const runStep = () => {
      if (currentStep >= timings.length) return;
      const { target, duration } = timings[currentStep];
      const diff = target - currentProgress;
      const steps = 20;
      const stepSize = diff / steps;
      const interval = duration / steps;

      let s = 0;
      const timer = setInterval(() => {
        s++;
        currentProgress += stepSize;
        setProgress(Math.min(currentProgress, 97));
        if (s >= steps) {
          clearInterval(timer);
          currentStep++;
          runStep();
        }
      }, interval);
    };

    runStep();
  }, []);

  return (
    <div className="w-full max-w-[180px] h-1 rounded-full overflow-hidden bg-steel/20">
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, background: color }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mahasiswa Loading (bg-clouds page)
───────────────────────────────────────────── */
export function MahasiswaLoadingScreen({ message = "Memuat data..." }: { message?: string }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4">
      <Image
        src="/loading.gif"
        alt="Loading..."
        width={128}
        height={128}
        className="h-28 w-28 object-contain"
        style={{ mixBlendMode: "multiply" }}
        unoptimized
        priority
      />
      <div className="flex flex-col items-center gap-2">
        <p className="font-display text-sm font-bold text-ink">{message}</p>
        <LoadingProgressBar color="#12284B" />
        <p className="font-mono text-[10px] text-steel">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

export function MahasiswaSkeletonPage() {
  return (
    <div className="relative min-h-screen bg-clouds overflow-hidden">
      {/* Skeleton layout — terlihat di belakang */}
      <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20 animate-pulse space-y-6">
        <div className="h-44 w-full rounded-3xl bg-steel/20 border border-steel/10" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-steel/15 border border-steel/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-10 w-1/3 rounded-xl bg-steel/20" />
            <div className="h-40 w-full rounded-2xl bg-steel/15 border border-steel/10" />
            <div className="h-40 w-full rounded-2xl bg-steel/15 border border-steel/10" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-2/3 rounded-xl bg-steel/20" />
            <div className="h-36 w-full rounded-2xl bg-steel/15 border border-steel/10" />
            <div className="h-48 w-full rounded-2xl bg-steel/15 border border-steel/10" />
          </div>
        </div>
      </div>

      {/* Loading indicator: di tengah, frosted card, tidak menutup penuh */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex flex-col items-center gap-3 rounded-2xl px-8 py-6 shadow-xl border border-steel/20"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)" }}
        >
          <Image
            src="/loading.gif"
            alt="Loading..."
            width={160}
            height={160}
            className="h-32 w-32 object-contain"
            style={{ mixBlendMode: "multiply" }}
            unoptimized
            priority
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-ink font-display">Memuat BridgeU...</p>
            <LoadingProgressBar color="#12284B" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Perusahaan Loading (bg putih / paper)
───────────────────────────────────────────── */
export function PerusahaanSkeletonPage() {
  return (
    <div className="relative min-h-screen bg-paper overflow-hidden">
      {/* Skeleton */}
      <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20 animate-pulse space-y-6">
        <div className="h-40 w-full rounded-2xl bg-steel/15 border border-steel/10" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-steel/15 border border-steel/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-10 w-1/3 rounded-xl bg-steel/15" />
            <div className="h-40 w-full rounded-2xl bg-steel/15 border border-steel/10" />
            <div className="h-40 w-full rounded-2xl bg-steel/15 border border-steel/10" />
          </div>
          <div className="space-y-4">
            <div className="h-10 w-2/3 rounded-xl bg-steel/15" />
            <div className="h-36 w-full rounded-2xl bg-steel/15 border border-steel/10" />
            <div className="h-48 w-full rounded-2xl bg-steel/15 border border-steel/10" />
          </div>
        </div>
      </div>

      {/* Loading indicator di tengah */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex flex-col items-center gap-3 rounded-2xl px-8 py-6 shadow-xl border border-steel/20"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}
        >
          <Image
            src="/loading.gif"
            alt="Loading..."
            width={160}
            height={160}
            className="h-32 w-32 object-contain"
            style={{ mixBlendMode: "multiply" }}
            unoptimized
            priority
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-ink font-display">Memuat BridgeU...</p>
            <LoadingProgressBar color="#1B3A63" />
            <p className="text-[10px] text-steel font-mono">Sedang menyiapkan data perusahaan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Admin Loading
───────────────────────────────────────────── */
export function AdminSkeletonPage() {
  return (
    <div className="relative min-h-screen bg-paper overflow-hidden">
      {/* Skeleton */}
      <div className="flex">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-64 shrink-0 h-screen bg-steel/10 animate-pulse border-r border-steel/10" />
        {/* Content skeleton */}
        <div className="flex-1 px-6 pt-20 pb-20 animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded-lg bg-steel/20" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-steel/15 border border-steel/10" />
            ))}
          </div>
          <div className="h-48 w-full rounded-2xl bg-steel/15 border border-steel/10" />
          <div className="h-48 w-full rounded-2xl bg-steel/15 border border-steel/10" />
        </div>
      </div>

      {/* Loading indicator di tengah */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex flex-col items-center gap-3 rounded-2xl px-8 py-6 shadow-xl border border-steel/20"
          style={{ background: "rgba(255,255,255,0.93)", backdropFilter: "blur(12px)" }}
        >
          <Image
            src="/loading.gif"
            alt="Loading..."
            width={160}
            height={160}
            className="h-32 w-32 object-contain"
            style={{ mixBlendMode: "multiply" }}
            unoptimized
            priority
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-ink font-display">Memuat Admin Panel...</p>
            <LoadingProgressBar color="#0F1A2E" />
            <p className="text-[10px] text-steel font-mono">Sedang menyiapkan data admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
