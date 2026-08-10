"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

/* ─── Icons ─── */
function IconBuilding({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconFile({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function IconLink({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function IconUsers({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconImage({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function IconChevronDown({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const UKURAN_OPTIONS = [
  "1–10 karyawan",
  "11–50 karyawan",
  "51–200 karyawan",
  "201–500 karyawan",
  "501–1000 karyawan",
  "1000+ karyawan",
];

interface Step2PerusahaanProps {
  formData: FormDataState;
  updateField: (field: keyof FormDataState, value: any) => void;
  openPicker: (picker: "sektor" | "kota") => void;
}

const inputClass =
  "w-full rounded-xl border border-[#173B6C]/20 bg-white/70 pl-10 pr-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm";

const pickerBtnClass = (hasValue: boolean) =>
  `w-full rounded-xl border ${
    hasValue
      ? "border-[#2475C5] bg-white/90 text-[#173B6C]"
      : "border-[#173B6C]/20 bg-white/70 text-[#173B6C]/50"
  } pl-10 pr-10 py-3 text-xs text-left flex items-center justify-between shadow-sm hover:bg-white transition focus:outline-none`;

export function Step2ProfilPerusahaan({
  formData,
  updateField,
  openPicker,
}: Step2PerusahaanProps) {
  return (
    <motion.div
      key="step2perusahaan"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-[#173B6C]">
          Langkah 2: Profil Perusahaan
        </h2>
        <p className="text-xs text-[#173B6C]/80 mt-1">
          Lengkapi identitas badan usaha, sektor industri, lokasi, dan informasi pendukung perusahaan kamu.
        </p>
      </div>

      <div className="space-y-4">
        {/* Sektor Industri — ModalPicker */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            Sektor Industri *
          </label>
          <div className="relative">
            <IconBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40 pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => openPicker("sektor")}
              className={pickerBtnClass(!!formData.industri)}
            >
              <span className="truncate">
                {formData.industri || "Pilih Sektor Industri..."}
              </span>
              <IconChevronDown className="w-4 h-4 text-[#173B6C]/40 shrink-0" />
            </button>
          </div>
        </div>

        {/* NIB */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            Nomor Induk Berusaha (NIB) *
          </label>
          <div className="relative">
            <IconFile className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40" />
            <input
              type="text"
              value={formData.nib}
              onChange={(e) => updateField("nib", e.target.value)}
              placeholder="Contoh: 9120001234567"
              className={`${inputClass} font-mono`}
            />
          </div>
          <span className="text-[11px] text-[#173B6C]/50 mt-1 block">
            NIB digunakan untuk proses verifikasi status akun perusahaan oleh admin BridgeU.
          </span>
        </div>

        {/* Kota / Lokasi — ModalPicker */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            Kota / Lokasi Kantor Pusat *
          </label>
          <div className="relative">
            <IconMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40 pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => openPicker("kota")}
              className={pickerBtnClass(!!formData.lokasiPerusahaan)}
            >
              <span className="truncate">
                {formData.lokasiPerusahaan || "Pilih Kota..."}
              </span>
              <IconChevronDown className="w-4 h-4 text-[#173B6C]/40 shrink-0" />
            </button>
          </div>
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            Alamat Lengkap
          </label>
          <div className="relative">
            <IconMapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#173B6C]/40" />
            <textarea
              rows={2}
              value={formData.alamatLengkap}
              onChange={(e) => updateField("alamatLengkap", e.target.value)}
              placeholder="Jl. Sudirman Kav. 1, Jakarta Selatan..."
              className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 pl-10 pr-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm resize-none"
            />
          </div>
        </div>

        {/* Row: Ukuran + Tahun Berdiri */}
        <div className="grid grid-cols-2 gap-3">
          {/* Ukuran Perusahaan */}
          <div>
            <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
              Ukuran Perusahaan
            </label>
            <div className="relative">
              <IconUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40 pointer-events-none" />
              <select
                value={formData.ukuranPerusahaan}
                onChange={(e) => updateField("ukuranPerusahaan", e.target.value)}
                className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 pl-10 pr-4 py-3 text-xs text-[#173B6C] focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm appearance-none"
              >
                <option value="">Pilih ukuran...</option>
                {UKURAN_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tahun Berdiri */}
          <div>
            <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
              Tahun Berdiri
            </label>
            <div className="relative">
              <IconCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40" />
              <input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                value={formData.tahunBerdiri}
                onChange={(e) => updateField("tahunBerdiri", e.target.value)}
                placeholder="2015"
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>
        </div>

        {/* Situs Web */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            Situs Web Resmi
          </label>
          <div className="relative">
            <IconLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40" />
            <input
              type="url"
              value={formData.situsWeb}
              onChange={(e) => updateField("situsWeb", e.target.value)}
              placeholder="https://perusahaan.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-xs font-bold text-[#173B6C] mb-1.5">
            URL Logo Perusahaan
          </label>
          <div className="relative">
            <IconImage className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#173B6C]/40" />
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => updateField("logoUrl", e.target.value)}
              placeholder="https://cdn.perusahaan.com/logo.png"
              className={inputClass}
            />
          </div>
          <span className="text-[11px] text-[#173B6C]/50 mt-1 block">
            Opsional — link gambar logo yang akan ditampilkan pada profil perusahaan kamu.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
