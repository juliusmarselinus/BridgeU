"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  dummyKolaborasi,
  dummyRegisteredCompanies,
  dummyManagedUsers,
  Kolaborasi,
  RegisteredCompany,
  ManagedUser,
} from "@/lib/dummy-data";

export default function AdminDashboardPage() {
  const [kolaborasiList, setKolaborasiList] = useState<Kolaborasi[]>([]);
  const [companyList, setCompanyList] = useState<RegisteredCompany[]>([]);
  const [userList, setUserList] = useState<ManagedUser[]>([]);

  useEffect(() => {
    // Hydrate Kolaborasi
    const storedKolaborasi = localStorage.getItem("bridgeu_kolaborasi_list");
    if (storedKolaborasi) {
      const parsed = JSON.parse(storedKolaborasi);
      queueMicrotask(() => setKolaborasiList(parsed));
    } else {
      queueMicrotask(() => setKolaborasiList(dummyKolaborasi));
    }

    // Hydrate Companies
    const storedCompanies = localStorage.getItem("bridgeu_registered_companies");
    if (storedCompanies) {
      const parsed = JSON.parse(storedCompanies);
      queueMicrotask(() => setCompanyList(parsed));
    } else {
      queueMicrotask(() => setCompanyList(dummyRegisteredCompanies));
    }

    // Hydrate Users
    const storedUsers = localStorage.getItem("bridgeu_managed_users");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      queueMicrotask(() => setUserList(parsed));
    } else {
      queueMicrotask(() => setUserList(dummyManagedUsers));
    }
  }, []);

  const totalUsers = userList.length;
  const totalKolaborasi = kolaborasiList.length;
  const pendingCompanies = companyList.filter((c) => c.statusVerifikasi === "Menunggu Verifikasi").length;
  const verifiedCompanies = companyList.filter((c) => c.statusVerifikasi === "Terverifikasi").length;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-ink p-8 sm:p-10 text-paper shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                System Administration
              </span>
              <span className="font-mono text-xs text-paper/60">BridgeU Control Center</span>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Dashboard Admin <span className="text-emerald-400">BridgeU</span>
            </h1>
            <p className="mt-2 text-paper/70 max-w-xl text-sm leading-relaxed">
              Pusat kendali untuk memoderasi postingan proyek kolaborasi, memverifikasi legalitas perusahaan mitra, dan mengelola seluruh akun pengguna.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/kolaborasi"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-mono text-xs font-bold text-ink transition hover:bg-emerald-400 shadow-md"
            >
              Moderasi Proyek
            </Link>
            <Link
              href="/admin/perusahaan"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs font-medium text-paper transition hover:bg-white/10"
            >
              Verifikasi Perusahaan ({pendingCompanies})
            </Link>
          </div>
        </div>

        {/* Ringkasan Statistik Sistem */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-8">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Total Pengguna</p>
            <p className="mt-1 font-display text-3xl font-bold text-paper">{totalUsers}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Peluang Kolaborasi</p>
            <p className="mt-1 font-display text-3xl font-bold text-bridge-gold">{totalKolaborasi}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Perlu Verifikasi</p>
            <p className="mt-1 font-display text-3xl font-bold text-yellow-400">{pendingCompanies}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-xs text-paper/60 uppercase tracking-wider">Mitra Terverifikasi</p>
            <p className="mt-1 font-display text-3xl font-bold text-emerald-400">{verifiedCompanies}</p>
          </div>
        </div>
      </div>

      {/* Kartu Manajemen Sistem */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink">
          Modul Pengelolaan Platform
        </h2>
        <p className="font-mono text-xs text-steel mt-0.5">
          Pilih modul di bawah ini untuk melakukan tugas administratif
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Modul Moderasi */}
          <Link
            href="/admin/kolaborasi"
            className="group rounded-3xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-500/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-display text-xl font-bold group-hover:scale-105 transition">
                🔍
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-emerald-700 transition">
                Moderasi Kolaborasi
              </h3>
              <p className="mt-2 text-xs text-steel leading-relaxed">
                Pantau setiap postingan studi kasus akademik dan magang dari perusahaan. Pastikan sesuai dengan aturan dan standar kualitas BridgeU.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-emerald-700 font-semibold">
              <span>Buka Moderasi →</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] text-blue-700">
                {totalKolaborasi} Proyek Dipantau
              </span>
            </div>
          </Link>

          {/* Modul Verifikasi Perusahaan */}
          <Link
            href="/admin/perusahaan"
            className="group rounded-3xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-500/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-display text-xl font-bold group-hover:scale-105 transition">
                ✓
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-emerald-700 transition">
                Verifikasi Perusahaan
              </h3>
              <p className="mt-2 text-xs text-steel leading-relaxed">
                Tinjau kelengkapan NIB & profil hukum perusahaan mitra baru untuk memberikan centang verified resmi pada platform.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-emerald-700 font-semibold">
              <span>Buka Verifikasi →</span>
              <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] text-yellow-700">
                {pendingCompanies} Perlu Tindakan
              </span>
            </div>
          </Link>

          {/* Modul Manajemen Pengguna */}
          <Link
            href="/admin/pengguna"
            className="group rounded-3xl border border-steel/15 bg-white/70 p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-500/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 font-display text-xl font-bold group-hover:scale-105 transition">
                👥
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-emerald-700 transition">
                Manajemen Pengguna
              </h3>
              <p className="mt-2 text-xs text-steel leading-relaxed">
                Kelola hak akses seluruh pengguna mahasiswa dan perusahaan terdaftar. Penangguhan akun jika terjadi penyalahgunaan.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-emerald-700 font-semibold">
              <span>Kelola Pengguna →</span>
              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] text-purple-700">
                {totalUsers} Akun Aktif
              </span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
