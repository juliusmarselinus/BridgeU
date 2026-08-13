"use client";

import React from "react";
import Image from "next/image";

export function MahasiswaLoadingScreen({ message = "Memuat data..." }: { message?: string }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
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
        <p className="font-display text-sm font-bold text-ink">{message}</p>
        <p className="font-mono text-xs text-steel">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

export function MahasiswaSkeletonPage() {
  return (
    <div className="relative min-h-screen bg-clouds overflow-hidden">

      {/* ─── SKELETON LAYOUT (latar belakang terlihat jelas) ─── */}
      <div className="mx-auto w-full max-w-6xl px-6 pt-28 pb-20 animate-pulse space-y-6">
        {/* Hero skeleton */}
        <div className="h-44 w-full rounded-3xl bg-steel/20 border border-steel/10" />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-steel/15 border border-steel/10" />
          ))}
        </div>

        {/* Main grid */}
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

      {/* ─── LOADING INDICATOR: tepat tengah layar, tipis, tidak menutup skeleton ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex flex-col items-center gap-3 rounded-2xl px-8 py-6 shadow-xl border border-steel/20"
          style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)" }}
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
          <div className="text-center space-y-0.5">
            <p className="text-sm font-bold text-ink font-display">Memuat BridgeU...</p>
            <p className="text-xs text-steel font-mono">Sedang menyiapkan data untukmu</p>
          </div>
        </div>
      </div>

    </div>
  );
}
