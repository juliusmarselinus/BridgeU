"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface Step2Props {
  formData: FormDataState;
  updateField: (field: keyof FormDataState, value: any) => void;
  openPicker: (picker: "univ" | "prodi" | "semester") => void;
}

export function Step2ProfilAkademik({ formData, updateField, openPicker }: Step2Props) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-[#173B6C]">Langkah 2: Profil Akademik</h2>
        <p className="text-xs text-[#173B6C]/80 mt-1">
          Pilih universitas, program studi, dan semester studi kamu.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {/* Universitas Modal Picker Trigger */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
            Universitas *
          </label>
          <button
            type="button"
            onClick={() => openPicker("univ")}
            className="w-full flex items-center justify-between rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-left text-[#173B6C] hover:border-[#2475C5] transition shadow-sm"
          >
            <span className={formData.universitas ? "font-bold text-[#173B6C]" : "text-[#173B6C]/50"}>
              {formData.isCustomUniv
                ? `Lainnya (${formData.customUnivInput || "Belum diisi"})`
                : formData.universitas || "-- Pilih Universitas --"}
            </span>
            <IconChevronRight className="w-4 h-4 text-[#173B6C]/50" />
          </button>
          {formData.isCustomUniv && (
            <div className="mt-2">
              <input
                type="text"
                value={formData.customUnivInput}
                onChange={(e) => {
                  updateField("customUnivInput", e.target.value);
                  updateField("universitas", e.target.value || "Lainnya");
                }}
                placeholder="Ketik Nama Universitas Kamu..."
                className="w-full rounded-xl border border-[#173B6C]/30 bg-white px-4 py-2.5 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:outline-none shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Program Studi Modal Picker Trigger */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
            Program Studi *
          </label>
          <button
            type="button"
            onClick={() => openPicker("prodi")}
            className="w-full flex items-center justify-between rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-left text-[#173B6C] hover:border-[#2475C5] transition shadow-sm"
          >
            <span className={formData.prodi ? "font-bold text-[#173B6C]" : "text-[#173B6C]/50"}>
              {formData.isCustomProdi
                ? `Lainnya (${formData.customProdiInput || "Belum diisi"})`
                : formData.prodi || "-- Pilih Program Studi --"}
            </span>
            <IconChevronRight className="w-4 h-4 text-[#173B6C]/50" />
          </button>
          {formData.isCustomProdi && (
            <div className="mt-2">
              <input
                type="text"
                value={formData.customProdiInput}
                onChange={(e) => {
                  updateField("customProdiInput", e.target.value);
                  updateField("prodi", e.target.value || "Lainnya");
                }}
                placeholder="Ketik Nama Program Studi Kamu..."
                className="w-full rounded-xl border border-[#173B6C]/30 bg-white px-4 py-2.5 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:outline-none shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Semester Modal Picker Trigger */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
            Semester Aktif *
          </label>
          <button
            type="button"
            onClick={() => openPicker("semester")}
            className="w-full flex items-center justify-between rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-left text-[#173B6C] hover:border-[#2475C5] transition shadow-sm"
          >
            <span className={formData.semester ? "font-bold text-[#173B6C]" : "text-[#173B6C]/50"}>
              {formData.semester || "-- Pilih Semester --"}
            </span>
            <IconChevronRight className="w-4 h-4 text-[#173B6C]/50" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
            Ringkasan Singkat Diri
          </label>
          <textarea
            rows={3}
            value={formData.ringkasanSelf}
            onChange={(e) => updateField("ringkasanSelf", e.target.value)}
            placeholder="Ceritakan latar belakang studi, minat kolaborasi, atau pengalaman singkat kamu..."
            className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
          />
        </div>
      </div>
    </motion.div>
  );
}
