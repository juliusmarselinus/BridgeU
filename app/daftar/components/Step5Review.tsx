"use client";

import React from "react";
import { motion } from "framer-motion";
import { FormDataState } from "../types";

interface Step5Props {
  formData: FormDataState;
}

export function Step5Review({ formData }: Step5Props) {
  const isPerusahaan = formData.role === "perusahaan";

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-[#173B6C]">
          {isPerusahaan ? "Konfirmasi Pendaftaran Perusahaan" : "Langkah 5: Konfirmasi Pendaftaran"}
        </h2>
        <p className="text-xs text-[#173B6C]/80 mt-1">
          Tinjau kembali data pendaftaran akun {isPerusahaan ? "Perusahaan" : "Mahasiswa"} kamu sebelum diselesaikan.
        </p>
      </div>

      <div className="rounded-2xl border border-white/30 bg-white/40 p-6 space-y-4 text-xs text-[#173B6C]">
        {isPerusahaan ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#173B6C]/10">
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Nama Perusahaan</span>
                <span className="font-bold text-[#173B6C] text-sm">{formData.nama || "-"}</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Email Resmi Perusahaan</span>
                <span className="font-bold text-[#173B6C] text-sm">{formData.email || "-"}</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Sektor Industri</span>
                <span className="font-bold text-[#2475C5]">{formData.industri || "-"}</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Nomor Induk Berusaha (NIB)</span>
                <span className="font-bold font-mono text-[#173B6C]">{formData.nib || "-"}</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Lokasi Kantor Pusat</span>
                <span className="font-bold text-[#173B6C]">{formData.lokasiPerusahaan || "-"}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Deskripsi Perusahaan:</span>
              <p className="text-xs text-[#173B6C]/90 bg-white/50 p-3 rounded-xl border border-white/40 leading-relaxed">
                {formData.deskripsiPerusahaan || "-"}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Fokus Program Kolaborasi:</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.fokusKolaborasi.length === 0 ? (
                  <span className="text-[#173B6C]/50 italic">Tidak ada fokus terpilih</span>
                ) : (
                  formData.fokusKolaborasi.map((item) => (
                    <span key={item} className="rounded-lg bg-[#173B6C]/10 border border-[#173B6C]/30 px-2.5 py-1 text-[11px] font-bold text-[#173B6C]">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#173B6C]/10">
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Nama Lengkap</span>
                <span className="font-bold text-[#173B6C] text-sm">{formData.nama || "-"}</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Email Mahasiswa</span>
                <span className="font-bold text-[#173B6C] text-sm">{formData.email || "-"}</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Universitas</span>
                <span className="font-bold text-[#2475C5]">
                  {formData.isCustomUniv ? formData.customUnivInput || "Lainnya" : formData.universitas || "-"}
                </span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Program Studi & Semester</span>
                <span className="font-bold text-[#173B6C]">
                  {formData.isCustomProdi ? formData.customProdiInput || "Lainnya" : formData.prodi || "-"} ({formData.semester || "-"})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Keahlian (Skills) Terpilih:</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.selectedSkills.length === 0 ? (
                  <span className="text-[#173B6C]/50 italic">Tidak ada (Dilewati)</span>
                ) : (
                  formData.selectedSkills.map((s) => (
                    <span key={s} className="rounded-lg bg-[#173B6C]/10 border border-[#173B6C]/30 px-2.5 py-1 text-[11px] font-bold text-[#173B6C]">
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-mono text-[11px] text-[#173B6C]/60 uppercase block">Kategori Minat Terpilih:</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.selectedMinat.length === 0 ? (
                  <span className="text-[#173B6C]/50 italic">Tidak ada (Dilewati)</span>
                ) : (
                  formData.selectedMinat.map((m) => (
                    <span key={m} className="rounded-lg bg-white/70 border border-[#173B6C]/20 px-2.5 py-1 text-[11px] font-bold text-[#173B6C]">
                      {m}
                    </span>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
