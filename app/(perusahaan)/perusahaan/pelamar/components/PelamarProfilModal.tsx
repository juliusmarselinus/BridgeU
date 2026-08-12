"use client";

import { useState } from "react";
import { PelamarDetail, StatusLamaran } from "../types/pelamar";

interface PelamarProfilModalProps {
  pelamar: PelamarDetail | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: StatusLamaran, catatan?: string) => void;
}

const AKTIF_STATUSES: StatusLamaran[] = ["Diterima", "Diproses", "Evaluasi", "Revisi", "Selesai"];

export function PelamarProfilModal({
  pelamar,
  onClose,
  onUpdateStatus,
}: PelamarProfilModalProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalCatatan, setEvalCatatan] = useState("");

  if (!pelamar) return null;

  const isAktif = AKTIF_STATUSES.includes(pelamar.status as StatusLamaran);
  const historyItems = pelamar.riwayat_pengumpulan || [];

  const handleSubmitEvaluasi = (status: "Revisi" | "Selesai") => {
    onUpdateStatus(pelamar.id, status, evalCatatan);
    setIsEvaluating(false);
    setEvalCatatan("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-steel/10 pb-4">
          <h3 className="font-display text-lg font-bold text-ink">Profil Pelamar</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-4 font-mono text-xs">
          <div>
            <span className="text-steel">Nama Lengkap:</span>
            <p className="font-sans text-sm font-bold text-ink">{pelamar.nama_lengkap}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-steel">Universitas:</span>
              <p className="font-sans text-xs text-ink">{pelamar.universitas}</p>
            </div>
            <div>
              <span className="text-steel">Program Studi:</span>
              <p className="font-sans text-xs text-ink">
                {pelamar.program_studi} (Smtr {pelamar.semester})
              </p>
            </div>
          </div>

          <div>
            <span className="text-steel">Skor Reputasi Platform:</span>
            <p className="font-sans text-xs font-bold text-bridge-gold">
              {pelamar.reputation_score} Pts
            </p>
          </div>

          <div>
            <span className="text-steel">Ringkasan Profil / Self Description:</span>
            <p className="mt-1 rounded-xl bg-steel/5 p-3 font-sans text-xs text-ink leading-relaxed">
              {pelamar.ringkasan_self}
            </p>
          </div>

          {pelamar.url_portofolio_dokumen && (
            <div>
              <span className="text-steel block font-bold text-[10px] uppercase">Link Portofolio &amp; Berkas Pendukung:</span>
              
                <a href={pelamar.url_portofolio_dokumen}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block rounded-xl bg-blue-50/50 p-2.5 font-sans text-xs font-bold text-bridge-gold underline truncate border border-blue-100"
              >
                {pelamar.url_portofolio_dokumen}
              </a>
            </div>
          )}
        </div>

        {/* ==================== SECTION: PROGRES & HASIL KOLABORASI ==================== */}
        {isAktif && (
          <div className="mt-6 border-t border-steel/10 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-bold text-ink">Progres &amp; Hasil Kolaborasi</h4>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold border ${
                  pelamar.status === "Evaluasi"
                    ? "bg-purple-100 text-purple-800 border-purple-300"
                    : pelamar.status === "Revisi"
                    ? "bg-orange-100 text-orange-800 border-orange-300"
                    : pelamar.status === "Selesai"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}
              >
                {pelamar.status === "Evaluasi" ? "Menunggu Evaluasi" : pelamar.status === "Revisi" ? "Perlu Revisi" : pelamar.status}
              </span>
            </div>

            {historyItems.length === 0 && !pelamar.url_hasil_kolaborasi ? (
              <p className="font-mono text-[11px] text-steel py-3 text-center bg-steel/5 rounded-xl">
                Belum ada karya yang diunggah mahasiswa.
              </p>
            ) : historyItems.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {historyItems.map((h: any, hIdx: number) => (
                  <div key={h.id || hIdx} className="bg-steel/5 p-3 rounded-xl border border-steel/10 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-steel/10 pb-1">
                      <span className="font-bold text-ink text-[11px]">Versi #{h.versi || historyItems.length - hIdx}</span>
                      <span className="text-[10px] text-steel">
                        {h.created_at
                          ? new Date(h.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                          : "-"}
                      </span>
                    </div>
                    <a
                      href={h.url_hasil}
                      target="_blank"
                      rel="noreferrer"
                      className="text-bridge-gold font-bold underline truncate block text-xs"
                    >
                      {h.url_hasil} ↗
                    </a>
                    {h.catatan_mahasiswa && (
                      <p className="font-sans text-[11px] text-ink italic bg-white p-2 rounded border border-steel/5">
                        &ldquo;{h.catatan_mahasiswa}&rdquo;
                      </p>
                    )}
                    {h.evaluasi_perusahaan && (
                      <p className="font-sans text-[11px] text-amber-950 bg-amber-100/60 p-2 rounded border border-amber-300">
                        <span className="block text-[9px] font-bold uppercase text-amber-800 not-italic">Catatan Perusahaan:</span>
                        &ldquo;{h.evaluasi_perusahaan}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-steel/5 p-3 rounded-xl border border-steel/10 space-y-1.5 font-mono text-xs">
                <a
                  href={pelamar.url_hasil_kolaborasi}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bridge-gold font-bold underline truncate block text-xs"
                >
                  {pelamar.url_hasil_kolaborasi} ↗
                </a>
                {pelamar.catatan_hasil_kolaborasi && (
                  <p className="font-sans text-[11px] text-ink italic bg-white p-2 rounded border border-steel/5">
                    &ldquo;{pelamar.catatan_hasil_kolaborasi}&rdquo;
                  </p>
                )}
              </div>
            )}

            {pelamar.status !== "Selesai" && (
              <>
                {!isEvaluating ? (
                  <button
                    onClick={() => setIsEvaluating(true)}
                    className="w-full rounded-full bg-bridge-gold px-4 py-2 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition"
                  >
                    Evaluasi &amp; Beri Masukan
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <textarea
                      rows={3}
                      value={evalCatatan}
                      onChange={(e) => setEvalCatatan(e.target.value)}
                      placeholder="Berikan feedback atau ulasan penyelesaian tugas mahasiswa..."
                      className="w-full rounded-xl border border-steel/15 px-3 py-2 text-xs outline-none focus:border-bridge-gold bg-white font-sans"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEvaluating(false);
                          setEvalCatatan("");
                        }}
                        className="rounded-full border border-steel/20 bg-white px-3 py-1.5 font-mono text-[10px] text-steel"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitEvaluasi("Revisi")}
                        className="rounded-full border border-orange-300 bg-orange-50 px-4 py-1.5 font-mono text-[10px] font-bold text-orange-800 hover:bg-orange-100"
                      >
                        Minta Revisi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitEvaluasi("Selesai")}
                        className="rounded-full bg-emerald-600 px-4 py-1.5 font-mono text-[10px] font-bold text-white hover:bg-emerald-700"
                      >
                        Setujui &amp; Selesai ✓
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {pelamar.status === "Menunggu" && (
          <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-steel/10">
            <button
              onClick={() => {
                onUpdateStatus(pelamar.id, "Ditolak");
                onClose();
              }}
              className="rounded-full bg-red-50 px-4 py-2 font-mono text-xs text-red-600 hover:bg-red-100 transition"
            >
              Tolak
            </button>
            <button
              onClick={() => {
                onUpdateStatus(pelamar.id, "Diterima");
                onClose();
              }}
              className="rounded-full bg-emerald-600 px-4 py-2 font-mono text-xs text-white hover:bg-emerald-700 font-semibold transition"
            >
              Terima Pelamar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}