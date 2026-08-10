"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: string;
  tujuan: string;
  tanggal: string;
};

const statusColor: Record<string, string> = {
  Menunggu: "bg-bridge-gold/15 text-bridge-gold",
  Diproses: "bg-steel/15 text-steel",
  Diterima: "bg-verified/15 text-verified",
  Ditolak: "bg-red-100 text-red-600",
  Selesai: "bg-ink/10 text-ink",
};

export default function StatusPage() {
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_pengajuan");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setPengajuan(parsed));
    }
  }, []);

  return (
    <main>
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-12">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Status Pengajuan
        </h1>
        <p className="mt-2 text-sm text-steel">
          Pantau perkembangan seluruh pengajuan kolaborasi kamu.
        </p>

        {pengajuan.length === 0 ? (
          <div className="mt-10 rounded-xl border border-steel/15 p-10 text-center">
            <p className="text-sm text-steel">
              Kamu belum mengajukan kolaborasi apapun.
            </p>
            <Link
              href="/kolaborasi"
              className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-steel"
            >
              Cari Peluang Kolaborasi
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {pengajuan
              .slice()
              .reverse()
              .map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-steel/15 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-steel">
                        {p.perusahaan}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                        {p.judul}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
                        statusColor[p.status] || "bg-steel/10 text-steel"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  {p.tujuan && (
                    <p className="mt-3 text-sm leading-relaxed text-steel">
                      &ldquo;{p.tujuan}&rdquo;
                    </p>
                  )}
                  <p className="mt-3 font-mono text-xs text-steel">
                    Diajukan: {p.tanggal}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}