"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { notifyPengajuanBerhasil } from "@/lib/notifications";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
  semester?: string;
  nomorRekening?: string;
  bankName?: string;
};

type Kolaborasi = {
  id: string;
  judul: string;
  perusahaan: string;
  tipe: string;
};

const STEPS = ["Data Pemohon", "Ketersediaan", "Portofolio", "Dokumen"];

const KETERSEDIAAN_OPTIONS = [
  "Full-time (5 hari/minggu)",
  "Part-time (2-3 hari/minggu)",
  "Fleksibel / Sesuai kebutuhan proyek",
];

function IconX({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconUpload({ className = "w-4 h-4 text-bridge-gold" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wide text-steel/60 uppercase">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink/90">{value}</p>
    </div>
  );
}

export function ApplyModal({
  data,
  user,
  onClose,
  onSuccess,
}: {
  data: Kolaborasi;
  user: StoredUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(0);
  const [tujuan, setTujuan] = useState("");
  const [ketersediaan, setKetersediaan] = useState(KETERSEDIAAN_OPTIONS[0]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [portofolio, setPortofolio] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mouseDownOnBackdrop = useRef(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const canGoNext = () => {
    if (step === 0) return tujuan.trim().length > 0;
    if (step === 1) return ketersediaan !== "" && tanggalMulai !== "";
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const currentUserId = sessionData?.session?.user?.id;

      if (token && data.id) {
        const res = await fetch("/api/kolaborasi/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kolaborasiId: data.id,
            portofolio,
            tujuanMengajukan: tujuan,
            ketersediaan,
            tanggalMulaiDiinginkan: tanggalMulai || null,
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("❌ [ApplyModal] Gagal pendaftaran:", json.error);
        } else if (currentUserId) {
          await notifyPengajuanBerhasil(currentUserId, data.judul, data.perusahaan);
        }
      }
    } catch (err) {
      console.error("Error submitting application:", err);
    }

    const existing = JSON.parse(localStorage.getItem("bridgeu_pengajuan") || "[]");
    existing.push({
      id: data.id,
      judul: data.judul,
      perusahaan: data.perusahaan,
      status: "Menunggu",
      tujuan,
      ketersediaan,
      tanggalMulai,
      portofolio,
      cvNama: cvFile?.name || null,
      pemohon: user.nama,
      tanggal: new Date().toLocaleDateString("id-ID"),
    });
    localStorage.setItem("bridgeu_pengajuan", JSON.stringify(existing));

    setSubmitting(false);
    onSuccess();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-in fade-in duration-200"
      onMouseDown={(e) => {
        mouseDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onMouseUp={(e) => {
        if (mouseDownOnBackdrop.current && e.target === e.currentTarget) {
          onClose();
        }
        mouseDownOnBackdrop.current = false;
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-paper shadow-2xl border border-steel/20 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-steel/10 px-7 py-5 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-ink">Ajukan Kolaborasi</h3>
            <p className="text-xs text-steel mt-0.5">{data.judul} — {data.perusahaan}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-full text-steel/70 hover:bg-steel/10 hover:text-steel transition active:scale-90 shrink-0"
          >
            <IconX className="w-4 h-4 text-bridge-gold" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-7 pt-4 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-steel">{STEPS[step]}</span>
            <span className="text-xs font-mono text-steel/70">{step + 1}/{STEPS.length}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-steel/10 overflow-hidden">
            <div
              className="h-full bg-bridge-gold rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-7 py-6 space-y-6 scrollbar-hide">
          {step === 0 && (
            <>
              <div className="rounded-xl border border-steel/15 bg-steel/5 p-5">
                <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-4">
                  Data Pemohon
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <InfoField label="Nama" value={user.nama} />
                  <InfoField label="Universitas" value={user.universitas} />
                  <InfoField label="Program Studi" value={user.prodi} />
                  {user.semester && <InfoField label="Semester" value={user.semester} />}
                </div>
                <p className="mt-4 text-[11px] text-steel/60">
                  Data ini otomatis diambil dari profil kamu dan tidak bisa diubah di sini.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-wider text-steel uppercase">
                  Tujuan / Alasan Mengajukan
                </label>
                <textarea
                  required
                  rows={4}
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  placeholder="Ceritakan kenapa kamu tertarik dengan kolaborasi ini..."
                  className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition"
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-2">
                  Ketersediaan Waktu
                </label>
                <div className="space-y-2">
                  {KETERSEDIAAN_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setKetersediaan(opt)}
                      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition ${
                        ketersediaan === opt
                          ? "border-ink bg-ink text-paper"
                          : "border-steel/20 bg-paper text-ink/80 hover:border-steel/40"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          ketersediaan === opt ? "border-bridge-gold" : "border-steel/30"
                        }`}
                      >
                        {ketersediaan === opt && <span className="h-2 w-2 rounded-full bg-bridge-gold" />}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-wider text-steel uppercase">
                  Tanggal Mulai yang Diinginkan
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium"
                />
                <p className="mt-1 text-[10px] text-steel/60">
                  Pilih tanggal mulai hari ini atau di masa mendatang. Tanggal lalu tidak dapat dipilih.
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="text-[10px] font-bold tracking-wider text-steel uppercase">
                Link Portofolio / LinkedIn / GitHub
              </label>
              <input
                type="url"
                value={portofolio}
                onChange={(e) => setPortofolio(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition"
              />
              <p className="mt-2 text-[11px] text-steel/60">
                Opsional, tapi disarankan biar perusahaan lebih mudah menilai kecocokan kamu.
              </p>
            </div>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-2">
                  Dokumen Pendukung (CV / Portofolio)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-steel/25 bg-steel/5 px-4 py-10 text-center cursor-pointer hover:border-bridge-gold/50 hover:bg-bridge-gold/5 transition">
                  <IconUpload className="w-6 h-6 text-bridge-gold" />
                  <span className="text-xs font-semibold text-ink">
                    {cvFile ? cvFile.name : "Klik untuk upload file (PDF, maks 5MB)"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-[11px] text-steel/60">Opsional, tapi sangat disarankan.</p>
              </div>

              <div className="rounded-xl border border-steel/15 bg-steel/5 p-5 space-y-2">
                <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-1">
                  Ringkasan Pengajuan
                </p>
                <p className="text-sm text-ink/80"><span className="text-steel/70">Posisi:</span> {data.judul}</p>
                <p className="text-sm text-ink/80"><span className="text-steel/70">Ketersediaan:</span> {ketersediaan}</p>
                <p className="text-sm text-ink/80"><span className="text-steel/70">Mulai:</span> {tanggalMulai || "—"}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-steel/10 px-7 py-5 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl border border-steel/20 px-5 py-2.5 text-sm font-semibold text-steel hover:bg-paper transition active:scale-95"
          >
            {step === 0 ? "Batal" : "Kembali"}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-paper transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              Lanjut →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-paper transition-colors flex items-center gap-2 disabled:opacity-60 active:scale-95"
            >
              <IconCheck className="w-4 h-4 text-bridge-gold" />
              {submitting ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
