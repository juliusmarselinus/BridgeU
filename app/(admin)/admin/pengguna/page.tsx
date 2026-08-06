"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dummyManagedUsers, ManagedUser } from "@/lib/dummy-data";

export default function AdminManajemenPenggunaPage() {
  const [userList, setUserList] = useState<ManagedUser[]>([]);
  const [filterRole, setFilterRole] = useState<"Semua" | "Mahasiswa" | "Perusahaan">("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("bridgeu_managed_users");
    if (stored) {
      const parsed = JSON.parse(stored);
      queueMicrotask(() => setUserList(parsed));
    } else {
      queueMicrotask(() => setUserList(dummyManagedUsers));
    }
  }, []);

  const handleToggleStatus = (id: string) => {
    const updated = userList.map((user) =>
      user.id === id
        ? { ...user, status: user.status === "Aktif" ? ("Suspended" as const) : ("Aktif" as const) }
        : user
    );
    setUserList(updated);
    localStorage.setItem("bridgeu_managed_users", JSON.stringify(updated));
  };

  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.detail.toLowerCase().includes(search.toLowerCase());

    if (filterRole === "Semua") return matchesSearch;
    return matchesSearch && user.role === filterRole;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="font-mono text-xs text-steel hover:text-ink transition inline-flex items-center gap-1.5"
          >
            ← Kembali ke Dashboard Admin
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink">
            Manajemen Akun Pengguna
          </h1>
          <p className="mt-0.5 text-sm text-steel">
            Kelola hak akses dan status keaktifan seluruh akun mahasiswa dan perusahaan terdaftar.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {(["Semua", "Mahasiswa", "Perusahaan"] as const).map((r) => {
            const count =
              r === "Semua" ? userList.length : userList.filter((u) => u.role === r).length;

            return (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`rounded-full px-4 py-2 font-medium transition ${
                  filterRole === r
                    ? "bg-ink text-paper border border-ink shadow-sm"
                    : "bg-white/60 text-steel border border-steel/20 hover:border-ink hover:text-ink"
                }`}
              >
                {r} ({count})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, atau perguruan tinggi..."
          className="rounded-full border border-steel/25 bg-white px-4 py-2 text-xs outline-none transition focus:border-emerald-500 w-full sm:w-72"
        />
      </div>

      {/* Tabel Pengguna */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-steel/15 bg-white/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-steel/15 bg-steel/5 font-mono uppercase text-steel text-[11px]">
                <th className="px-6 py-4">Pengguna</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Detail Institusi / Industri</th>
                <th className="px-6 py-4">Tanggal Bergabung</th>
                <th className="px-6 py-4">Status Akun</th>
                <th className="px-6 py-4 text-right">Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-steel font-mono">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-ink text-sm">{user.nama}</div>
                      <div className="font-mono text-steel text-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          user.role === "Mahasiswa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-steel max-w-xs">{user.detail}</td>
                    <td className="px-6 py-4 font-mono text-steel">{user.tanggalGabung}</td>
                    <td className="px-6 py-4 font-mono">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          user.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status === "Aktif" ? "✓ Aktif" : "🚫 Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition ${
                          user.status === "Aktif"
                            ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        }`}
                      >
                        {user.status === "Aktif" ? "Tangguhkan (Suspend)" : "Aktifkan Akun"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
