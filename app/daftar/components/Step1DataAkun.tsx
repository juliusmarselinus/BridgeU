"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

interface Step1Props {
  formData: FormDataState;
  updateField: (field: keyof FormDataState, value: any) => void;
}

export function Step1DataAkun({ formData, updateField }: Step1Props) {
  const isPerusahaan = formData.role === "perusahaan";

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
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[#173B6C] uppercase mb-1.5">
              Konfirmasi Password *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="Ulangi password"
              className="w-full rounded-xl border border-[#173B6C]/20 bg-white/70 px-4 py-3 text-xs text-[#173B6C] placeholder-[#173B6C]/40 focus:border-[#2475C5] focus:bg-white focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
