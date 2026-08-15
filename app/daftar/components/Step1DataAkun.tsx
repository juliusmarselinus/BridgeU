"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

interface Step1Props {
  formData: FormDataState;
  updateField: (field: keyof FormDataState, value: any) => void;
}

function IconEye({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 1 12s4 7 11 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function Step1DataAkun({ formData, updateField }: Step1Props) {
  const isPerusahaan = formData.role === "perusahaan";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-[#173B6C]">
          {isPerusahaan ? "Langkah 1: Akun Resmi Perusahaan" : "Langkah 1: Informasi Akun Mahasiswa"}
        </h2>
        <p className="text-xs text-[#173B6C]/80 mt-1">
          {isPerusahaan
            ? "Masukkan nama badan usaha dan kredensial resmi untuk membuat akun mitra perusahaan di BridgeU."
            : "Masukkan nama lengkap dan kredensial untuk membuat akun pendaftaran mahasiswa BridgeU."}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
            {isPerusahaan ? "Nama Resmi Perusahaan *" : "Nama Lengkap *"}
          </label>
          <input
            type="text"
            value={formData.nama}
            onChange={(e) => updateField("nama", e.target.value)}
            placeholder={isPerusahaan ? "Contoh: PT Technology Nusantara Digital" : "Contoh: Julius Marselinus"}
            className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
            {isPerusahaan ? "Email Resmi Perusahaan *" : "Email Mahasiswa *"}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder={isPerusahaan ? "contact@perusahaan.com" : "nama@student.umn.ac.id"}
            className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 pr-10 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#173B6C]/50 hover:text-[#173B6C] transition"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
              Konfirmasi Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Ulangi password"
                className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 pr-10 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#173B6C]/50 hover:text-[#173B6C] transition"
                aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showConfirmPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
