"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

function IconAcademic({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconBuilding({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface Step0Props {
  formData: FormDataState;
  onSelectRole: (role: "mahasiswa" | "perusahaan") => void;
}

export function Step0RoleSelection({ formData, onSelectRole }: Step0Props) {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-8"
    >
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="font-display text-3xl font-bold text-[#173B6C]">Pilih Peran Pendaftaran</h2>
        <p className="text-xs sm:text-sm text-[#173B6C]/80 leading-relaxed">
          Selamat datang di BridgeU. Silakan pilih peran pendaftaran kamu untuk memulai pengalaman kolaborasi terintegrasi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Role Mahasiswa Card */}
        <button
          type="button"
          onClick={() => onSelectRole("mahasiswa")}
          className={`group rounded-3xl p-6 md:p-8 text-left transition-all duration-300 border flex flex-col justify-between space-y-6 ${
            formData.role === "mahasiswa"
              ? "bg-[#173B6C] text-white border-[#173B6C] shadow-2xl scale-[1.02]"
              : "bg-white/60 text-[#173B6C] border-white/40 hover:bg-white/90 hover:shadow-xl hover:scale-[1.01]"
          }`}
        >
          <div className="space-y-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                formData.role === "mahasiswa"
                  ? "bg-white/20 text-white"
                  : "bg-[#173B6C]/10 text-[#173B6C] group-hover:bg-[#173B6C] group-hover:text-white"
              }`}
            >
              <IconAcademic className="w-7 h-7" />
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Pencari Peluang
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight">
                Mahasiswa / Mahasiswi
              </h3>
            </div>

            <p className="text-xs leading-relaxed opacity-80">
              Ajukan kolaborasi proyek ke perusahaan nyata, ikuti program magang, bangun portofolio akademik, dan tingkatkan reputasi kamu.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-current/15">
            <span className="text-xs font-bold">Daftar Akun Mahasiswa</span>
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center border transition ${
                formData.role === "mahasiswa"
                  ? "bg-white text-[#173B6C] border-white"
                  : "border-[#173B6C]/30 text-transparent group-hover:border-[#173B6C]"
              }`}
            >
              <IconCheck className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Role Perusahaan Card */}
        <button
          type="button"
          onClick={() => onSelectRole("perusahaan")}
          className={`group rounded-3xl p-6 md:p-8 text-left transition-all duration-300 border flex flex-col justify-between space-y-6 ${
            formData.role === "perusahaan"
              ? "bg-[#173B6C] text-white border-[#173B6C] shadow-2xl scale-[1.02]"
              : "bg-white/60 text-[#173B6C] border-white/40 hover:bg-white/90 hover:shadow-xl hover:scale-[1.01]"
          }`}
        >
          <div className="space-y-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                formData.role === "perusahaan"
                  ? "bg-white/20 text-white"
                  : "bg-[#173B6C]/10 text-[#173B6C] group-hover:bg-[#173B6C] group-hover:text-white"
              }`}
            >
              <IconBuilding className="w-7 h-7" />
            </div>

            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                Penyedia Kolaborasi
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight">
                Perusahaan / Mitra
              </h3>
            </div>

            <p className="text-xs leading-relaxed opacity-80">
              Publikasikan studi kasus industri, terima lamaran mahasiswa berbakat, buka posisi magang, dan kelola kolaborasi terpusat.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-current/15">
            <span className="text-xs font-bold">Daftar Akun Perusahaan</span>
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center border transition ${
                formData.role === "perusahaan"
                  ? "bg-white text-[#173B6C] border-white"
                  : "border-[#173B6C]/30 text-transparent group-hover:border-[#173B6C]"
              }`}
            >
              <IconCheck className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
