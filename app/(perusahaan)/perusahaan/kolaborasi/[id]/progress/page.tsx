"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ProgresItem {
  pendaftaranId: string;
  mahasiswaId: string;
  nama: string;
  fotoUrl?: string;
  prodi: string;
  status: string; // Diterima | Selesai
  latestEvaluasi: string | null; // status_evaluasi terbaru
  totalVersi: number;
  lastUpdate: string | null;
}

const STAGE_ORDER = ["Diterima", "Menunggu Review", "Revisi Diminta", "Disetujui"];

function resolveStage(status: string, latestEvaluasi: string | null, totalVersi: number) {
  if (status === "Selesai") return "Disetujui";
  if (totalVersi === 0) return "Diterima";
  if (latestEvaluasi === "Disetujui") return "Disetujui";
  if (latestEvaluasi === "Revisi") return "Revisi Diminta";
  return "Menunggu Review";
}

export default function ProgresKolaborasiPage() {
  const { id } = useParams();
  const [items, setItems] = useState<ProgresItem[]>([]);
  const [judul, setJudul] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function load() {
      const { data, error } = await supabase
        .from("kolaborasi")
        .select(`
          judul,
          pendaftaran_kolaborasi (
            id, mahasiswa_id, status,
            mahasiswa_profiles ( nama_lengkap, foto_url, program_studi ( nama_prodi ) ),
            riwayat_pengumpulan_kolaborasi ( status_evaluasi, created_at )
          )
        `)
        .eq("id", id as string)
        .single();

      if (error || !isMounted) return;

      setJudul(data.judul);

      const mapped: ProgresItem[] = (data.pendaftaran_kolaborasi || [])
        .filter((p: any) => p.status === "Diterima" || p.status === "Selesai")
        .map((p: any) => {
          const riwayat = (p.riwayat_pengumpulan_kolaborasi || []).sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          return {
            pendaftaranId: p.id,
            mahasiswaId: p.mahasiswa_id,
            nama: p.mahasiswa_profiles?.nama_lengkap || "Mahasiswa",
            fotoUrl: p.mahasiswa_profiles?.foto_url,
            prodi: p.mahasiswa_profiles?.program_studi?.nama_prodi || "-",
            status: p.status,
            latestEvaluasi: riwayat[0]?.status_evaluasi || null,
            totalVersi: riwayat.length,
            lastUpdate: riwayat[0]?.created_at || null,
          };
        });

      setItems(mapped);
      setIsLoading(false);
    }

    load();
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat progres kolaborasi...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      <div className="border-b border-steel/15 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-steel">
          <Link href={`/perusahaan/kolaborasi/${id}`} className="hover:text-ink transition">
            {judul}
          </Link>
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink font-medium">Progres</span>
        </div>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">
          Progres Mahasiswa
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-steel/20 bg-white p-12 text-center font-mono text-xs text-steel">
            Belum ada mahasiswa yang diterima pada proyek ini.
          </div>
        ) : (
          items.map((item) => {
            const stage = resolveStage(item.status, item.latestEvaluasi, item.totalVersi);
            const stageIdx = STAGE_ORDER.indexOf(stage);
            return (
              <Link
                key={item.pendaftaranId}
                href={`/perusahaan/kolaborasi/${id}/progres/${item.pendaftaranId}`}
                className="rounded-2xl border border-steel/15 bg-white p-5 hover:border-bridge-gold/50 hover:shadow-md transition block"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-steel/10 overflow-hidden shrink-0 flex items-center justify-center font-display font-bold text-steel">
                    {item.fotoUrl ? (
                      <img src={item.fotoUrl} alt={item.nama} className="h-full w-full object-cover" />
                    ) : (
                      item.nama.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-ink truncate">{item.nama}</p>
                    <p className="font-mono text-[10px] text-steel truncate">{item.prodi}</p>
                  </div>
                </div>

                {/* BridgeRail */}
                <div className="mt-4 flex items-center">
                  {STAGE_ORDER.map((s, i) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          i <= stageIdx ? "bg-bridge-gold" : "bg-steel/20"
                        }`}
                      />
                      {i < STAGE_ORDER.length - 1 && (
                        <div className={`h-0.5 flex-1 ${i < stageIdx ? "bg-bridge-gold" : "bg-steel/15"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 font-mono text-[10px] font-semibold text-ink">{stage}</p>
                <p className="mt-1 font-mono text-[10px] text-steel">
                  {item.totalVersi} kali submit
                  {item.lastUpdate ? ` · terakhir ${new Date(item.lastUpdate).toLocaleDateString("id-ID")}` : ""}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}