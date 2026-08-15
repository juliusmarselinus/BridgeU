"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type StoredUser = {
  nama: string;
  email?: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  nomorRekening?: string;
  bankName?: string;
};

const KETERSEDIAAN_OPTIONS = [
  "Full-time (5 hari/minggu)",
  "Part-time (2-3 hari/minggu)",
  "Fleksibel / Sesuai kebutuhan proyek",
];

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

export default function DaftarKolaborasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [kolaborasi, setKolaborasi] = useState<any | null>(null);

  const [showBankAlertModal, setShowBankAlertModal] = useState(false);

  // Form Fields
  const [step, setStep] = useState(0);
  const [tujuan, setTujuan] = useState("");
  const [ketersediaan, setKetersediaan] = useState(KETERSEDIAAN_OPTIONS[0]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [portofolio, setPortofolio] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const STEPS = ["Data Pemohon", "Ketersediaan & Tanggal", "Portofolio & Dokumen"];

  useEffect(() => {
    async function initData() {
      setLoading(true);

      // Cek Session & Profile User
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      let currentUser: StoredUser | null = null;

      if (token) {
        try {
          const res = await fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const me = await res.json();
            currentUser = {
              nama: me.nama,
              email: me.email,
              universitas: me.universitas || "-",
              prodi: me.prodi || "Mahasiswa",
              semester: me.semester || "-",
              nomorRekening: me.nomorRekening || "",
              bankName: me.bankName || "",
            };
          }
        } catch (e) {
          console.error("Gagal load profile di pendaftaran:", e);
        }
      }

      if (!currentUser) {
        const stored = localStorage.getItem("bridgeu_user");
        if (stored) {
          try { currentUser = JSON.parse(stored); } catch (e) { console.error(e); }
        }
      }

      setUser(currentUser);

      // Cek Data Kolaborasi & hitung tanggal mulai otomatis (1 hari setelah batas_waktu)
      if (id) {
        const { data: row } = await supabase
          .from("kolaborasi")
          .select(`
            id, judul, tipe, deskripsi, batas_waktu,
            perusahaan:perusahaan_id ( nama_perusahaan )
          `)
          .eq("id", id as string)
          .maybeSingle();

        if (row) {
          setKolaborasi(row);
          if (row.batas_waktu) {
            const endDate = new Date(row.batas_waktu);
            endDate.setDate(endDate.getDate() + 1);
            // Format YYYY-MM-DD untuk input date / tampilan
            const formattedDefaultStart = endDate.toISOString().split("T")[0];
            setTanggalMulai(formattedDefaultStart);
          } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setTanggalMulai(tomorrow.toISOString().split("T")[0]);
          }
        }
      }

      setLoading(false);
    }

    initData();
  }, [id]);

  const canGoNext = () => {
    if (step === 0) return tujuan.trim().length > 0;
    if (step === 1) return ketersediaan !== "" && tanggalMulai !== "";
    return true;
  };

  const handleSubmit = async () => {
    // Validasi Wajib Rekening Bank jika tipe Magang
    const isMagang = kolaborasi?.tipe === "Magang";
    const hasRekening = Boolean(user?.nomorRekening && user.nomorRekening.trim().length > 0);

    if (isMagang && !hasRekening) {
      setShowBankAlertModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (token && id) {
        const res = await fetch("/api/kolaborasi/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kolaborasiId: id as string,
            portofolio,
            tujuanMengajukan: tujuan,
            ketersediaan,
            tanggalMulaiDiinginkan: tanggalMulai || null,
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("❌ [DaftarPage] Gagal menyimpan pendaftaran ke Supabase:", json.error);
        }
      }
    } catch (err) {
      console.error("Error submitting application:", err);
    }

    // Backup LocalStorage
    const existing = JSON.parse(localStorage.getItem("bridgeu_pengajuan") || "[]");
    existing.push({
      id: id,
      judul: kolaborasi?.judul || "Kolaborasi",
      perusahaan: kolaborasi?.perusahaan?.nama_perusahaan || "Mitra",
      status: "Menunggu",
      tujuan,
      ketersediaan,
      tanggalMulai,
      portofolio,
      cvNama: cvFile?.name || null,
      pemohon: user?.nama || "Mahasiswa",
      tanggal: new Date().toLocaleDateString("id-ID"),
    });
    localStorage.setItem("bridgeu_pengajuan", JSON.stringify(existing));

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center pt-24 pb-16">
        <div className="rounded-3xl border border-steel/15 bg-white p-8 text-center shadow-md">
          <div className="h-6 w-48 bg-steel/10 rounded-lg animate-pulse mx-auto mb-3" />
          <div className="h-3 w-32 bg-steel/10 rounded animate-pulse mx-auto" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center pt-24 pb-16 px-4">
        <div className="w-full max-w-md rounded-3xl border border-steel/20 bg-white p-8 text-center shadow-lg space-y-4">
          <h3 className="font-display text-xl font-bold text-ink">Belum Masuk Akun</h3>
          <p className="text-xs text-steel">Silakan masuk ke akun mahasiswa kamu terlebih dahulu untuk mendaftar kolaborasi.</p>
          <Link
            href="/?auth=login"
            className="inline-block w-full rounded-2xl bg-ink py-3 text-xs font-mono font-bold text-paper hover:bg-steel transition shadow-md"
          >
            Masuk Ke Akun
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-paper pt-28 pb-20 px-4">
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-emerald-300 bg-white p-8 text-center shadow-xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">Pendaftaran Berhasil Dikirim!</h2>
          <p className="text-xs text-steel leading-relaxed">
            Permohonan kamu untuk <strong className="text-ink">{kolaborasi?.judul}</strong> telah resmi terdaftar ke perusahaan. Silakan pantau perkembangan seleksi pada halaman status.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/status"
              className="flex-1 rounded-2xl bg-ink py-3 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md text-center"
            >
              Pantau Status Pengajuan →
            </Link>
            <Link
              href="/kolaborasi"
              className="flex-1 rounded-2xl border border-steel/20 bg-white py-3 font-mono text-xs font-semibold text-steel hover:bg-paper transition text-center"
            >
              Kembali ke Kolaborasi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="min-h-screen bg-paper pt-24 pb-32 text-ink font-sans">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 space-y-6">
        {/* Tombol Batal / Kembali */}
        <button
          onClick={() => router.push(`/kolaborasi/${id}`)}
          className="inline-flex items-center gap-2 font-mono text-xs text-steel hover:text-bridge-gold transition font-bold"
        >
          ← Batalkan &amp; Kembali ke Detail Project
        </button>

        {/* HEADER FORM */}
        <div className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold text-bridge-gold bg-bridge-gold/15 px-3 py-1 rounded-full border border-bridge-gold/30">
              Formulir Pendaftaran
            </span>
            <span className="font-mono text-xs text-steel">{kolaborasi?.perusahaan?.nama_perusahaan}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-ink">
            {kolaborasi?.judul || "Pendaftaran Kolaborasi"}
          </h1>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="rounded-3xl border border-steel/15 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">Langkah {step + 1}: {STEPS[step]}</span>
            <span className="text-xs font-mono text-steel">{step + 1} dari {STEPS.length}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-steel/10 overflow-hidden">
            <div
              className="h-full bg-bridge-gold rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CONTENT STEPS CARD */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-steel/15 bg-white p-6 sm:p-8 shadow-md space-y-6"
        >
          {/* STEP 0: Data Pemohon & Tujuan */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-steel/15 bg-steel/5 p-5">
                <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-4">
                  Data Pemohon Terverifikasi
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <InfoField label="Nama Lengkap" value={user.nama} />
                  <InfoField label="Universitas" value={user.universitas || "-"} />
                  <InfoField label="Program Studi" value={user.prodi || "-"} />
                  <InfoField label="Semester" value={user.semester || "-"} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-1">
                  Tujuan & Motivasi Mengajukan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={tujuan}
                  onChange={(e) => setTujuan(e.target.value)}
                  placeholder="Jelaskan alasan dan tujuan kamu tertarik bergabung dalam kolaborasi ini..."
                  className="w-full rounded-2xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 1: Ketersediaan & Tanggal Mulai (Locked H+1) */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-3">
                  Ketersediaan Waktu Kerja <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2.5">
                  {KETERSEDIAAN_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setKetersediaan(opt)}
                      className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold transition ${
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

              {/* Tanggal Mulai: Locked H+1 */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-1">
                  Tanggal Mulai Pelaksanaan (Otomatis H+1 Setelah Batas Waktu)
                </label>
                <input
                  type="date"
                  disabled
                  value={tanggalMulai}
                  className="w-full rounded-2xl border border-steel/20 bg-steel/10 px-4 py-3 text-sm text-steel font-bold cursor-not-allowed outline-none"
                />
                <p className="mt-1.5 text-xs text-steel">
                  Tanggal mulai diset otomatis 1 hari setelah batas pendaftaran berakhir dan tidak dapat diubah.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Portofolio & LinkedIn */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-steel uppercase mb-1">
                  Link Portofolio / GitHub / LinkedIn / Google Drive Dokumen
                </label>
                <input
                  type="url"
                  value={portofolio}
                  onChange={(e) => setPortofolio(e.target.value)}
                  placeholder="https://linkedin.com/in/username atau https://github.com/..."
                  className="w-full rounded-2xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium"
                />
                <p className="mt-1.5 text-xs text-steel">
                  Lampirkan URL portofolio atau LinkedIn kamu untuk mempermudah perusahaan melakukan evaluasi profil.
                </p>
              </div>

              {/* Ringkasan Akhir */}
              <div className="rounded-2xl border border-steel/15 bg-paper p-5 space-y-2">
                <p className="text-[10px] font-bold tracking-wider text-steel/70 uppercase mb-2">
                  Ringkasan Pendaftaran
                </p>
                <p className="text-xs text-steel"><strong className="text-ink">Posisi Proyek:</strong> {kolaborasi?.judul}</p>
                <p className="text-xs text-steel"><strong className="text-ink">Ketersediaan:</strong> {ketersediaan}</p>
                <p className="text-xs text-steel"><strong className="text-ink">Tanggal Mulai:</strong> {tanggalMulai}</p>
                <p className="text-xs text-steel"><strong className="text-ink">URL Portofolio:</strong> {portofolio || "—"}</p>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-steel/10">
            <button
              type="button"
              onClick={() => {
                if (step > 0) setStep((s) => s - 1);
                else router.push(`/kolaborasi/${id}`);
              }}
              className="rounded-2xl border border-steel/20 px-5 py-2.5 text-xs font-semibold text-steel hover:bg-paper transition"
            >
              {step === 0 ? "Batal" : "← Kembali"}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canGoNext()}
                className="rounded-2xl bg-ink px-6 py-2.5 text-xs font-bold text-paper transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-steel"
              >
                Lanjut ke Langkah {step + 2} →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-2xl bg-bridge-gold px-7 py-2.5 text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md flex items-center gap-2 disabled:opacity-60"
              >
                <IconCheck className="w-4 h-4 text-ink" />
                {submitting ? "Mengirim Pendaftaran..." : "Kirim Pendaftaran Kolaborasi"}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Pop Up Alert: Wajib Isi Rekening Bank untuk Kolaborasi Tipe Magang */}
      {showBankAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 animate-in fade-in duration-200">
          <div className="flex w-full max-w-md flex-col rounded-3xl bg-white p-6 shadow-2xl border border-steel/20 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 mx-auto">
              <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-ink">Rekening Bank Wajib Diisi!</h3>
              <p className="text-xs text-steel leading-relaxed">
                Untuk mengajukan kolaborasi tipe <strong className="text-ink font-semibold">Magang</strong>, kamu wajib mendaftarkan informasi <strong className="text-ink font-semibold">Rekening Bank</strong> terlebih dahulu pada profil kamu untuk proses penyaluran insentif/pencairan.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/profile"
                className="w-full rounded-xl bg-ink py-2.5 text-center text-xs font-bold text-paper transition hover:bg-steel shadow-sm"
              >
                Lengkapi Rekening Bank di Profil →
              </Link>
              <button
                type="button"
                onClick={() => setShowBankAlertModal(false)}
                className="w-full rounded-xl border border-steel/20 py-2.5 text-xs font-semibold text-steel hover:bg-paper transition"
              >
                Tutup & Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
