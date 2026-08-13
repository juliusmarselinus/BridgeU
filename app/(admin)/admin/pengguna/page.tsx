"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminPengguna } from "./hooks/useAdminPengguna";
import { ActionModal } from "@/components/ActionModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { GradientBars } from "@/components/ui/gradient-bars-background";
import { AdminSkeletonPage } from "@/components/ui/MahasiswaLoading";

export default function AdminManajemenPenggunaPage() {
  const {
    userList,
    filteredUsers,
    isLoading,
    filterRole,
    setFilterRole,
    search,
    setSearch,
    handleToggleStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    errorModal,
    setErrorModal,
    confirmModal,
    setConfirmModal,
  } = useAdminPengguna();

  if (isLoading) return <AdminSkeletonPage />;

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-secondary/15 via-clouds to-clouds pb-12 font-sans text-ink">
      {errorModal && (
        <ActionModal
          isOpen={!!errorModal}
          onClose={() => setErrorModal(null)}
          title={errorModal.title}
          message={errorModal.message}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={() => handleToggleStatus(confirmModal.id, confirmModal.currentStatus)}
          title={confirmModal.title}
          message={confirmModal.message}
        />
      )}
      <GradientBars
        numBars={20}
        gradientFrom="rgb(176, 208, 218)"
        gradientTo="transparent"
        animationDuration={7}
        className="opacity-70"
      />

      {/* Ambient background blobs — beda posisi & nuansa per halaman, biar ga identik sama Kolaborasi/Perusahaan */}
      {/* Steel-Cone-style conic sweep — direkonstruksi pakai palet BridgeU (ocean/primary/sky/clouds), bukan abu-abu asli */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[900px] w-[900px] opacity-[0.16] blur-3xl"
        style={{
          background:
            "conic-gradient(from 45deg at 50% 50%, #EDF4FA 0%, #8CC1E9 25%, #12284B 50%, #8CC1E9 75%, #EDF4FA 100%)",
        }}
      />

      {/* Ambient background blobs — khas halaman Manajemen Pengguna */}
      <div className="pointer-events-none absolute top-[420px] left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-secondary/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 right-0 h-72 w-72 rounded-full bg-sky/15 blur-3xl" />

      {/* Hero Header */}
      <div className="relative z-10 w-full bg-clouds">
        <div
          className="relative w-full pt-28 pb-16 overflow-hidden rounded-b-[2.5rem] shadow-[0_20px_50px_-20px_rgba(18,40,75,0.45)]"
          style={{
            background: "linear-gradient(160deg, #12284B 0%, #1B3A63 45%, #8CC1E9 100%)",
          }}
        >
          <GradientBars
            numBars={16}
            gradientFrom="rgba(140, 193, 233, 0.3)"
            gradientTo="transparent"
            animationDuration={3.5}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(140,193,233,0.15),transparent_60%)]" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-6">
            <Link
              href="/admin/dashboard"
              className="font-mono text-xs font-semibold text-sky hover:text-white transition inline-flex items-center gap-1.5 mb-3 group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span> Kembali ke Dashboard Admin
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              Manajemen Akun Pengguna
            </h1>
            <p className="mt-1.5 text-sm font-medium text-paper/90 max-w-2xl leading-relaxed">
              Kelola hak akses dan status keaktifan seluruh akun mahasiswa dan perusahaan terdaftar pada platform BridgeU.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto max-w-[1400px] px-6 -mt-8 space-y-6">
        {/* Search & Filter Card */}
        <div className="rounded-3xl bg-white shadow-[8px_8px_20px_rgba(33,109,192,0.1),-8px_-8px_20px_rgba(255,255,255,0.6)] p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {(["Semua", "Mahasiswa", "Perusahaan"] as const).map((r) => {
              const count =
                r === "Semua" ? userList.length : userList.filter((u) => u.role === r).length;

              return (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                    filterRole === r
                      ? "bg-ink text-paper shadow-md scale-105"
                      : "bg-white text-steel shadow-[3px_3px_8px_rgba(33,109,192,0.08),-3px_-3px_8px_rgba(255,255,255,0.5)] hover:text-ink hover:shadow-[4px_4px_10px_rgba(33,109,192,0.08),-4px_-4px_10px_rgba(255,255,255,0.55)]"
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
            className="rounded-full bg-white shadow-[inset_4px_4px_10px_rgba(33,109,192,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.5)] px-4 py-2 text-xs text-ink placeholder:text-steel/50 outline-none transition-all focus:ring-2 focus:ring-primary/30 w-full sm:w-72"
          />
        </div>

        {/* Grid List Pengguna (2x4 mobile, 4x2 desktop) */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 rounded-3xl bg-white shadow-[8px_8px_20px_rgba(33,109,192,0.1),-8px_-8px_20px_rgba(255,255,255,0.6)] p-4 animate-pulse"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-primary/20 bg-white p-12 text-center">
            <p className="text-xs font-mono text-steel">Tidak ada pengguna ditemukan.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={user.id}
                  className="rounded-3xl bg-white shadow-[8px_8px_20px_rgba(33,109,192,0.1),-8px_-8px_20px_rgba(255,255,255,0.6)] p-5 transition-all duration-300 hover:shadow-[10px_10px_28px_rgba(33,109,192,0.16),-10px_-10px_28px_rgba(255,255,255,0.65)] hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 border-b border-border/40 pb-2">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded-full font-semibold ${
                          user.role === "Mahasiswa"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role}
                      </span>

                      <span
                        className={`font-mono text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                          user.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-700 border border-rose-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-sm font-bold text-ink leading-tight truncate">
                        {user.nama}
                      </h3>
                      <p className="font-mono text-xs text-steel truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="bg-white shadow-[inset_4px_4px_10px_rgba(33,109,192,0.08),inset_-4px_-4px_10px_rgba(255,255,255,0.5)] p-2 rounded-2xl space-y-0.5">
                      <span className="block font-mono font-semibold text-steel uppercase text-xs">
                        Detail:
                      </span>
                      <p className="font-mono font-medium text-ink text-xs line-clamp-2 leading-tight">
                        {user.detail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border/40 space-y-1.5">
                    <span className="font-mono text-xs text-steel block">
                      Tgl: {user.tanggalGabung}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`w-full rounded-full py-1 font-mono text-xs font-semibold transition active:scale-95 text-center cursor-pointer ${
                        user.status === "Aktif"
                          ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      }`}
                    >
                      {user.status === "Aktif" ? "Suspend" : "Aktifkan"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 pt-6">
            <p className="text-xs text-steel font-mono">
              Menampilkan {filteredUsers.length} dari {totalCount} pengguna
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-full bg-white shadow-[4px_4px_12px_rgba(33,109,192,0.09),-4px_-4px_12px_rgba(255,255,255,0.5)] px-4 py-1.5 font-mono text-xs font-semibold text-ink transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-ink font-semibold">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full bg-white shadow-[4px_4px_12px_rgba(33,109,192,0.09),-4px_-4px_12px_rgba(255,255,255,0.5)] px-4 py-1.5 font-mono text-xs font-semibold text-ink transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

