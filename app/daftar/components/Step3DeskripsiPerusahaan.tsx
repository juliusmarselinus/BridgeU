"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const PROGRAM_FOKUS = [
  "Studi Kasus & Project-Based",
  "Program Magang Industri",
  "Riset & Inovasi Akademik",
  "Mentorship & Masterclass",
  "Rekrutmen Talenta Lulusan",
];

interface Step3PerusahaanProps {
  formData: FormDataState;
  updateField: (field: keyof FormDataState, value: any) => void;
}

export function Step3DeskripsiPerusahaan({ formData, updateField }: Step3PerusahaanProps) {
  const toggleFokus = (item: string) => {
    const exists = formData.fokusKolaborasi.includes(item);
    const updated = exists
      ? formData.fokusKolaborasi.filter((f) => f !== item)
      : [...formData.fokusKolaborasi, item];
    updateField("fokusKolaborasi", updated);
  };

  return (
    <motion.div
      key="step3perusahaan"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-[#173B6C]">Langkah 3: Deskripsi & Fokus Kolaborasi</h2>
        <p className="text-xs text-[#173B6C]/80 mt-1">
          Jelaskan gambaran singkat perusahaan serta jenis program kolaborasi yang ingin dipublikasikan di BridgeU.
        </p>
      </div>

      <div className="space-y-4">
        {/* Deskripsi Perusahaan */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            Deskripsi Perusahaan *
          </label>
          <textarea
            rows={4}
            value={formData.deskripsiPerusahaan}
            onChange={(e) => updateField("deskripsiPerusahaan", e.target.value)}
            placeholder="Jelaskan secara singkat visi, produk/layanan utama, dan budaya kerja perusahaan kamu..."
            className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 p-3.5 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm resize-none"
          />
        </div>

        {/* Fokus Program Kolaborasi */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-2">
            Fokus Program Kolaborasi (Pilih Minimal 1) *
          </label>
          <div className="flex flex-wrap gap-2.5">
            {PROGRAM_FOKUS.map((item) => {
              const isSelected = formData.fokusKolaborasi.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFokus(item)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? "bg-[#173B6C] text-white border-[#173B6C] shadow-md"
                      : "bg-white/60 text-[#173B6C] border-white/40 hover:bg-white/90"
                  }`}
                >
                  {isSelected && <IconCheck className="w-3.5 h-3.5 text-white" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
