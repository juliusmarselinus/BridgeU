"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string;
  versi: number;
  url_hasil: string;
  catatan_mahasiswa: string;
  evaluasi_perusahaan: string | null;
  status_evaluasi: string | null;
  created_at: string;
}

export default function DetailProgresPage() {
  const { id, pelamarId } = useParams();
  const [nama, setNama] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [keputusan, setKeputusan] = useState<"Disetujui" | "Revisi">("Disetujui");

  const latest = submissions[0] || null;

  useEffect(() => {
    if (!pelamarId) return;
    let isMounted = true;

    async function load() {
      const { data: pendaftaran, error } = await supabase
        .from("pendaftaran_kolaborasi")
        .select(`
          mahasiswa_profiles ( nama_lengkap ),
          riwayat_pengumpulan_kolaborasi ( id, versi, url_hasil, catatan_mahasiswa, evaluasi_perusahaan, status_evaluasi, created_at )
        `)
        .eq("id", pelamarId as string)
        .single();
      if (error || !pendaftaran || !isMounted) return;

      const mProfile = Array.isArray(pendaftaran.mahasiswa_profiles)
        ? pendaftaran.mahasiswa_profiles[0]
        : pendaftaran.mahasiswa_profiles;
      setNama(mProfile?.nama_lengkap || "Mahasiswa");
      const sorted = (pendaftaran.riwayat_pengumpulan_kolaborasi || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setSubmissions(sorted);
      setIsLoading(false);
    }

    load();
    return () => { isMounted = false; };
  }, [pelamarId]);

  const handleEvaluasi = async () => {
    if (!latest) return;
    if (!confirm(`Yakin ingin menandai submission ini sebagai "${keputusan}"?`)) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("riwayat_pengumpulan_kolaborasi")
      .update({ status_evaluasi: keputusan, evaluasi_perusahaan: catatan || null })
      .eq("id", latest.id);
    setIsSaving(false);

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === latest.id ? { ...s, status_evaluasi: keputusan, evaluasi_perusahaan: catatan || s.evaluasi_perusahaan } : s))
      );
      setCatatan("");
      alert("Evaluasi berhasil disimpan.");
    } else {
      alert("Gagal menyimpan evaluasi.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat progres mahasiswa...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-16">
      <div className="border-b border-steel/15 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-steel">
          <Link href={`/perusahaan/kolaborasi/${id}/progres`} className="hover:text-ink transition">
            Progres
          </Link>
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink font-medium">{nama}</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">{nama}</h1>
      </div>

      {/* Form evaluasi hasil terbaru */}
      {latest && (
        <div className="mt-8 rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-ink">
            Hasil Terbaru (Versi {latest.versi})
          </h3>
          
          <a
            href={latest.url_hasil}
            target="_blank"
            rel="noreferrer"
            className="inline-block font-mono text-xs text-bridge-gold underline hover:text-ink"
          >
            Lihat Dokumen Hasil →
          </a>
          <p className="font-mono text-xs text-steel leading-relaxed">
            {latest.catatan_mahasiswa || "Tidak ada catatan dari mahasiswa."}
          </p>

          <div className="pt-2 border-t border-steel/10 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setKeputusan("Disetujui")}
                className={`flex-1 rounded-xl px-4 py-2 font-mono text-xs font-bold border transition ${
                  keputusan === "Disetujui" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-steel border-steel/20"
                }`}
              >
                Setujui
              </button>
              <button
                type="button"
                onClick={() => setKeputusan("Revisi")}
                className={`flex-1 rounded-xl px-4 py-2 font-mono text-xs font-bold border transition ${
                  keputusan === "Revisi" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-steel border-steel/20"
                }`}
              >
                Minta Revisi
              </button>
            </div>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan evaluasi untuk mahasiswa..."
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans"
            />
            <button
              type="button"
              onClick={handleEvaluasi}
              disabled={isSaving}
              className="rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-white hover:bg-steel transition disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Evaluasi"}
            </button>
          </div>
        </div>
      )}

      {/* Timeline semua versi */}
      <div className="mt-8">
        <h3 className="font-display text-base font-bold text-ink mb-3">Riwayat Submission</h3>
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <p className="font-mono text-xs text-steel">Belum ada submission dari mahasiswa ini.</p>
          ) : (
            submissions.map((s) => (
              <div key={s.id} className="rounded-xl border border-steel/15 bg-white p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold text-ink">Versi {s.versi}</p>
                  <p className="font-mono text-[10px] text-steel mt-1">
                    {new Date(s.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] font-semibold border shrink-0 ${
                    s.status_evaluasi === "Disetujui"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : s.status_evaluasi === "Revisi"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-steel/5 text-steel border-steel/15"
                  }`}
                >
                  {s.status_evaluasi || "Menunggu Review"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}