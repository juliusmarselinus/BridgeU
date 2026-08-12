"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { pelamarService } from "../../../pelamar/services/pelamarService";
import { PelamarDetail, StatusLamaran } from "../../../pelamar/types/pelamar";

export default function ReviewPelamarPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [kolaborasiJudul, setKolaborasiJudul] = useState("");
  const [pelamarList, setPelamarList] = useState<PelamarDetail[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Menunggu" | "Semua" | "Ditolak" | "Diterima">("Menunggu");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    async function loadPelamarData() {
      setIsLoading(true);
      try {
        const { data: row, error } = await supabase
          .from("kolaborasi")
          .select(`
            judul,
            pendaftaran_kolaborasi (
              id,
              kolaborasi_id,
              mahasiswa_id,
              tanggal_daftar,
              status,
              catatan_perusahaan,
              url_portofolio_dokumen,
              mahasiswa_profiles (
                nama_lengkap,
                semester,
                ringkasan_self,
                foto_url,
                reputation_score,
                universitas ( nama_universitas ),
                program_studi ( nama_prodi )
              )
            )
          `)
          .eq("id", id as string)
          .single();

        if (!error && row) {
          setKolaborasiJudul(row.judul || "");
          const mapped: PelamarDetail[] = (row.pendaftaran_kolaborasi || []).map((p: any) => {
            const mProfile = p.mahasiswa_profiles;
            return {
              id: p.id,
              kolaborasi_id: p.kolaborasi_id,
              mahasiswa_id: p.mahasiswa_id,
              nama_lengkap: mProfile?.nama_lengkap || "Mahasiswa",
              universitas: mProfile?.universitas?.nama_universitas || "Universitas Tidak Diketahui",
              program_studi: mProfile?.program_studi?.nama_prodi || "Program Studi Tidak Diketahui",
              semester: mProfile?.semester || "-",
              ringkasan_self: mProfile?.ringkasan_self || "Tidak ada deskripsi profil.",
              foto_url: mProfile?.foto_url,
              reputation_score: mProfile?.reputation_score || 0,
              tanggal_daftar: p.tanggal_daftar,
              status: p.status,
              catatan_perusahaan: p.catatan_perusahaan,
              url_portofolio_dokumen: p.url_portofolio_dokumen,
            };
          });
          setPelamarList(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat pelamar:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPelamarData();
  }, [id]);

  const handleKonfirmasi = async (pendaftaranId: string, newStatus: StatusLamaran) => {
    const confirmMsg =
      newStatus === "Diterima"
        ? "Apakah Anda yakin ingin MENERIMA pendaftaran mahasiswa ini?"
        : "Apakah Anda yakin ingin MENOLAK pendaftaran mahasiswa ini?";

    if (!confirm(confirmMsg)) return;

    const isSuccess = await pelamarService.updateStatusPelamar(pendaftaranId, newStatus);

    if (isSuccess) {
      setPelamarList((prev) =>
        prev.map((p) => (p.id === pendaftaranId ? { ...p, status: newStatus } : p))
      );

      setSuccessMsg(
        newStatus === "Diterima"
          ? "Mahasiswa berhasil diterima! Mahasiswa kini aktif di workspace proyek."
          : "Pendaftaran mahasiswa telah ditolak."
      );

      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      alert("Gagal memperbarui status pendaftaran pelamar.");
    }
  };

  const filteredPelamar = pelamarList.filter((p) => {
    if (filterStatus === "Menunggu") return p.status === "Menunggu";
    if (filterStatus === "Diterima") return p.status === "Diterima";
    if (filterStatus === "Ditolak") return p.status === "Ditolak";
    return true;
  });

  const countMenunggu = pelamarList.filter((p) => p.status === "Menunggu").length;
  const countDiterima = pelamarList.filter((p) => p.status === "Diterima").length;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat daftar pendaftaran pelamar...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-16 font-sans">
      {/* Breadcrumb Header */}
      <div className="border-b border-steel/15 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-steel mb-2">
          <Link href="/perusahaan/kolaborasi" className="hover:text-ink transition">
            Kelola Kolaborasi
          </Link>
          <svg className="h-3 w-3 shrink-0 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link href={`/perusahaan/kolaborasi/${id}`} className="hover:text-ink transition truncate max-w-[200px]">
            {kolaborasiJudul}
          </Link>
          <svg className="h-3 w-3 shrink-0 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink font-medium">Review Pendaftaran Pelamar</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              Review Pendaftaran Pelamar Baru
            </h1>
            <p className="font-mono text-xs text-steel mt-1">
              Periksa kualifikasi &amp; portofolio pelamar, lalu tentukan penerimaan sebelum masuk ke workspace proyek.
            </p>
          </div>

          <Link
            href={`/perusahaan/kolaborasi/${id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-steel transition shadow-sm shrink-0"
          >
            🚀 Masuk Workspace Proyek ({countDiterima})
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center justify-between animate-fade-in shadow-sm">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-900 hover:underline text-[10px]">
            Tutup
          </button>
        </div>
      )}

      {/* Filter Tabs Status Pendaftaran */}
      <div className="mt-6 flex items-center gap-2 font-mono text-xs">
        <button
          onClick={() => setFilterStatus("Menunggu")}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            filterStatus === "Menunggu"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white text-steel border border-steel/15 hover:bg-steel/5"
          }`}
        >
          ⏳ Menunggu Konfirmasi ({countMenunggu})
        </button>

        <button
          onClick={() => setFilterStatus("Diterima")}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            filterStatus === "Diterima"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-steel border border-steel/15 hover:bg-steel/5"
          }`}
        >
          ✅ Diterima ({countDiterima})
        </button>

        <button
          onClick={() => setFilterStatus("Ditolak")}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            filterStatus === "Ditolak"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white text-steel border border-steel/15 hover:bg-steel/5"
          }`}
        >
          ❌ Ditolak ({pelamarList.filter((p) => p.status === "Ditolak").length})
        </button>

        <button
          onClick={() => setFilterStatus("Semua")}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            filterStatus === "Semua"
              ? "bg-ink text-white shadow-sm"
              : "bg-white text-steel border border-steel/15 hover:bg-steel/5"
          }`}
        >
          Semua ({pelamarList.length})
        </button>
      </div>

      {/* Grid Cards Pelamar */}
      <div className="mt-6">
        {filteredPelamar.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-12 text-center font-mono text-xs text-steel space-y-2">
            <p className="font-bold text-ink">Tidak ada pelamar dengan status ini.</p>
            <p>Pilih kategori filter lain di bagian atas untuk melihat pendaftaran pelamar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPelamar.map((pelamar) => (
              <div
                key={pelamar.id}
                className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4 hover:border-steel/30 transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header Pelamar */}
                  <div className="flex items-start justify-between gap-3 border-b border-steel/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-bridge-gold/20 border border-bridge-gold/40 flex items-center justify-center font-display text-base font-bold text-ink overflow-hidden">
                        {pelamar.foto_url ? (
                          <img src={pelamar.foto_url} alt={pelamar.nama_lengkap} className="h-full w-full object-cover" />
                        ) : (
                          pelamar.nama_lengkap.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold text-ink">
                            {pelamar.nama_lengkap}
                          </h3>
                          <span className="rounded-full bg-bridge-gold/20 px-2 py-0.5 font-mono text-[9px] font-bold text-ink">
                            ⭐ {pelamar.reputation_score} Pts
                          </span>
                        </div>
                        <p className="font-mono text-xs text-steel">
                          {pelamar.universitas} &bull; {pelamar.program_studi} (Semester {pelamar.semester})
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold border shrink-0 ${
                        pelamar.status === "Diterima"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : pelamar.status === "Ditolak"
                          ? "bg-red-50 text-red-800 border-red-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {pelamar.status}
                    </span>
                  </div>

                  {/* Ringkasan Self */}
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-ink block">Self Description / Ringkasan Profil:</span>
                    <p className="font-sans text-xs text-steel bg-steel/5 rounded-xl p-3.5 leading-relaxed border border-steel/10">
                      {pelamar.ringkasan_self}
                    </p>
                  </div>

                  {/* Dokumen Portofolio */}
                  {pelamar.url_portofolio_dokumen && (
                    <div className="font-mono text-xs bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 flex items-center justify-between">
                      <span className="font-bold text-ink">Portofolio Pendaftaran:</span>
                      <a
                        href={pelamar.url_portofolio_dokumen}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bridge-gold underline hover:text-ink font-bold"
                      >
                        Buka Dokumen ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-steel/10 flex items-center justify-between gap-3 font-mono text-xs">
                  <span className="text-[10px] text-steel">
                    Daftar: {new Date(pelamar.tanggal_daftar).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                  </span>

                  {pelamar.status === "Menunggu" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleKonfirmasi(pelamar.id, "Ditolak")}
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white px-5 py-2 font-bold transition shadow-sm"
                      >
                        ❌ Tolak
                      </button>
                      <button
                        onClick={() => handleKonfirmasi(pelamar.id, "Diterima")}
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 font-bold transition shadow-md"
                      >
                        ✅ Terima Pelamar
                      </button>
                    </div>
                  ) : pelamar.status === "Diterima" ? (
                    <Link
                      href={`/perusahaan/kolaborasi/${id}`}
                      className="rounded-full bg-emerald-700 text-white px-5 py-2 font-bold text-[11px] hover:bg-emerald-800 transition"
                    >
                      Buka di Workspace Proyek ↗
                    </Link>
                  ) : (
                    <span className="text-[10px] font-bold text-red-600">Pendaftaran Ditolak</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
