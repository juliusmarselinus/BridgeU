"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { dummyKolaborasi } from "@/lib/dummy-data";

type StoredUser = {
  nama: string;
  universitas: string;
  prodi: string;
};

export default function DetailKolaborasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);
  const [tujuan, setTujuan] = useState("");
  const [user, setUser] = useState<StoredUser | null>(null);

  const data = dummyKolaborasi.find((k) => k.id === id);

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-steel">Peluang kolaborasi tidak ditemukan.</p>
        <Link
          href="/kolaborasi"
          className="mt-4 inline-block text-bridge-gold underline"
        >
          Kembali ke daftar
        </Link>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = JSON.parse(
      localStorage.getItem("bridgeu_pengajuan") || "[]"
    );
    existing.push({
      id: data.id,
      judul: data.judul,
      perusahaan: data.perusahaan,
      status: "Menunggu",
      tujuan,
      pemohon: user?.nama || "Tidak diketahui",
      tanggal: new Date().toLocaleDateString("id-ID"),
    });
    localStorage.setItem("bridgeu_pengajuan", JSON.stringify(existing));
    setSubmitted(true);
  };

  return (
    <main>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-steel/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight"
          >
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
          <span className="font-mono text-xs text-steel">
            {data.perusahaan}
          </span>
          <span
            className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
              data.tipe === "Akademik"
                ? "bg-steel/10 text-steel"
                : "bg-bridge-gold/15 text-bridge-gold"
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

        <p className="mt-6 text-[15px] leading-relaxed text-steel">
          {data.deskripsi}
        </p>

        {/* SECTION PENGAJUAN */}
        <div className="mt-10 border-t border-steel/10 pt-8">
          {submitted ? (
            <div className="rounded-xl border border-verified/30 bg-verified/5 p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">
                Pengajuan terkirim
              </p>
              <p className="mt-2 text-sm text-steel">
                Status pengajuan kamu:{" "}
                <span className="text-bridge-gold">Menunggu</span>
              </p>
              <Link
                href="/kolaborasi"
                className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-steel"
              >
                Kembali ke Daftar Kolaborasi
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-lg font-semibold text-ink">
                Ajukan Kolaborasi
              </h2>

              {/* DATA PEMOHON — otomatis dari akun login */}
              {user ? (
                <div className="mt-5 rounded-lg border border-steel/15 bg-steel/5 p-4">
                  <p className="font-mono text-xs uppercase tracking-wide text-steel">
                    Data Pemohon
                  </p>
                  <p className="mt-2 font-display text-sm font-semibold text-ink">
                    {user.nama}
                  </p>
                  <p className="text-sm text-steel">
                    {user.universitas} — {user.prodi}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-lg border border-bridge-gold/30 bg-bridge-gold/10 p-4">
                  <p className="text-sm text-ink">
                    Kamu belum masuk. Silakan{" "}
                    <Link href="/" className="text-bridge-gold underline">
                      masuk terlebih dahulu
                    </Link>{" "}
                    sebelum mengajukan kolaborasi.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wide text-steel">
                    Tujuan / Alasan Mengajukan
                  </label>
                  <textarea
                    required
                    value={tujuan}
                    onChange={(e) => setTujuan(e.target.value)}
                    placeholder="Ceritakan kenapa kamu tertarik dengan kolaborasi ini..."
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-steel/25 px-4 py-3 text-sm outline-none transition focus:border-ink"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-wide text-steel">
                    Dokumen Pendukung (opsional)
                  </label>
                  <input
                    type="file"
                    className="mt-1 w-full rounded-lg border border-steel/25 px-4 py-3 text-sm outline-none transition focus:border-ink"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!user}
                  className="mt-2 rounded-lg bg-ink py-3 text-sm font-medium text-paper transition hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Kirim Pengajuan
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}