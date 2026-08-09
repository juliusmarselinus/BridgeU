"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { dummyKolaborasi } from "@/lib/dummy-data";
import { ApplyModal } from "@/components/ApplyModal";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
};

export default function DetailKolaborasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = dummyKolaborasi.find((k) => k.id === id);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setUser(parsed));
    }
  }, []);

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-steel">Peluang kolaborasi tidak ditemukan.</p>
        <Link href="/kolaborasi" className="mt-4 inline-block text-bridge-gold underline">
          Kembali ke daftar
        </Link>
      </main>
    );
  }

  return (
    <main>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-steel/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Bridge<span className="text-bridge-gold">U</span>
          </Link>
          <button
            onClick={() => router.push("/kolaborasi")}
            className="font-mono text-xs text-steel transition hover:text-ink"
          >
            ← Kembali ke daftar
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* HEADER DETAIL */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-steel">{data.perusahaan}</span>
          <span
            className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
              data.tipe === "Akademik" ? "bg-steel/10 text-steel" : "bg-bridge-gold/15 text-bridge-gold"
            }`}
          >
            {data.tipe}
          </span>
        </div>

        <h1 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {data.judul}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-steel">
          <span>Kategori: {data.kategori}</span>
          <span>Lokasi: {data.lokasi}</span>
          <span>Batas: {data.batasWaktu}</span>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-steel">{data.deskripsi}</p>

        {/* SECTION PENGAJUAN */}
        <div className="mt-10 border-t border-steel/10 pt-8">
          {submitted ? (
            <div className="rounded-xl border border-verified/30 bg-verified/5 p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">Pengajuan terkirim</p>
              <p className="mt-2 text-sm text-steel">
                Status pengajuan kamu: <span className="text-bridge-gold">Menunggu</span>
              </p>
              <Link
                href="/kolaborasi"
                className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-steel"
              >
                Kembali ke Daftar Kolaborasi
              </Link>
            </div>
          ) : user ? (
            <div className="rounded-xl border border-steel/15 bg-steel/5 p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">Tertarik dengan peluang ini?</p>
              <p className="mt-2 text-sm text-steel">
                Ajukan kolaborasi ini sebagai <span className="font-semibold text-ink">{user.nama}</span>.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-5 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-steel"
              >
                Ajukan Kolaborasi
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-bridge-gold/30 bg-bridge-gold/10 p-4 text-center">
              <p className="text-sm text-ink">
                Kamu belum masuk. Silakan{" "}
                <Link href="/" className="text-bridge-gold underline">
                  masuk terlebih dahulu
                </Link>{" "}
                sebelum mengajukan kolaborasi.
              </p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && user && (
        <ApplyModal
          data={data}
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setSubmitted(true);
          }}
        />
      )}
    </main>
  );
}