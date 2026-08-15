"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { companyService } from "../dashboard/services/companyServices";
import { PerusahaanSkeletonPage } from "@/components/ui/MahasiswaLoading";

export interface InterviewItem {
  id: string;
  kolaborasi_id: string;
  student_id: string;
  perusahaan_id: string;
  scheduled_at: string;
  meeting_link: string;
  status: "Scheduled" | "Completed" | "Cancelled" | string;
  notes?: string | null;
  created_at: string;
  mahasiswa_profiles?: {
    nama_lengkap: string;
    foto_url?: string;
    universitas_id?: number;
    prodi_id?: number;
  };
  kolaborasi?: {
    judul: string;
    tipe: string;
  };
}

export default function CompanyJadwalPage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Edit Modal State
  const [editingInterview, setEditingInterview] = useState<InterviewItem | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const minEditDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const compData = await companyService.fetchCompanyProfile();
      if (compData) {
        const { data, error } = await supabase
          .from("interviews")
          .select(`
            *,
            mahasiswa_profiles ( nama_lengkap, foto_url ),
            kolaborasi ( judul, tipe )
          `)
          .eq("perusahaan_id", compData.user_id)
          .order("scheduled_at", { ascending: true });

        if (error) {
          console.error("Gagal mengambil data wawancara:", error.message);
        } else {
          setInterviews(data || []);
        }
      }
    } catch (err) {
      console.error("Gagal memuat jadwal wawancara:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const matchesStatus =
        filterStatus === "Semua" || item.status.toLowerCase() === filterStatus.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const namaMahasiswa = item.mahasiswa_profiles?.nama_lengkap?.toLowerCase() || "";
      const judulProyek = item.kolaborasi?.judul?.toLowerCase() || "";
      const matchesQuery = !q || namaMahasiswa.includes(q) || judulProyek.includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [interviews, filterStatus, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("interviews")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Gagal mengubah status: " + error.message);
    } else {
      setInterviews((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
    }
  };

  const openEditModal = (inv: InterviewItem) => {
    setEditingInterview(inv);
    const d = new Date(inv.scheduled_at);
    setEditDate(d.toISOString().split("T")[0]);
    setEditTime(d.toTimeString().slice(0, 5));
    setEditLink(inv.meeting_link || "");
    setEditNotes(inv.notes || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInterview || !editDate || !editTime) return;

    setIsSavingEdit(true);
    const newScheduledAt = new Date(`${editDate}T${editTime}`).toISOString();

    const { error } = await supabase
      .from("interviews")
      .update({
        scheduled_at: newScheduledAt,
        meeting_link: editLink.trim() || "https://meet.google.com/abc-defg-hij",
        notes: editNotes.trim() || null,
      })
      .eq("id", editingInterview.id);

    setIsSavingEdit(false);

    if (error) {
      alert("Gagal memperbarui jadwal: " + error.message);
    } else {
      setEditingInterview(null);
      loadData();
    }
  };

  if (isLoading) return <PerusahaanSkeletonPage />;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16 space-y-8 font-sans text-ink">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-steel/15 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-steel mb-1">
            <Link href="/perusahaan/dashboard" className="hover:text-ink transition">
              Dashboard
            </Link>
            <span>&rsaquo;</span>
            <span className="text-ink font-semibold">Jadwal Wawancara</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
            Kelola Jadwal Wawancara Pelamar
          </h1>
          <p className="font-mono text-xs text-steel mt-1">
            Pantau dan atur seluruh sesi wawancara mahasiswa dari berbagai proyek kolaborasi.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-steel/15 shadow-sm font-mono text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Scheduled", "Completed", "Cancelled"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl font-bold transition shrink-0 ${
                filterStatus === st
                  ? "bg-ink text-white shadow-sm"
                  : "bg-steel/5 text-steel hover:bg-steel/10"
              }`}
            >
              {st === "Scheduled" ? "Mendatang" : st === "Completed" ? "Selesai" : st === "Cancelled" ? "Dibatalkan" : st}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mahasiswa atau proyek..."
            className="w-full rounded-xl border border-steel/20 px-3.5 py-2 pl-9 text-xs outline-none focus:border-bridge-gold bg-white"
          />
          <svg className="w-4 h-4 text-steel/40 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Cards List Grid */}
      {filteredInterviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-steel/20 bg-white p-12 text-center font-mono text-xs text-steel">
          Tidak ada jadwal wawancara yang ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInterviews.map((inv) => {
            const isScheduled = inv.status === "Scheduled";
            const isCompleted = inv.status === "Completed";
            const isCancelled = inv.status === "Cancelled";
            const dt = new Date(inv.scheduled_at);

            return (
              <div
                key={inv.id}
                className="rounded-2xl border border-steel/15 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header Card */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-steel/10">
                    <div>
                      <h3 className="font-display text-sm font-bold text-ink">
                        {inv.mahasiswa_profiles?.nama_lengkap || "Mahasiswa"}
                      </h3>
                      <p className="font-mono text-[10.5px] text-steel mt-0.5 truncate max-w-[180px]">
                        {inv.kolaborasi?.judul || "Proyek Kolaborasi"}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isScheduled
                          ? "bg-sky/15 text-ocean border-sky/30"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {isScheduled ? "Mendatang" : isCompleted ? "Selesai" : "Dibatalkan"}
                    </span>
                  </div>

                  {/* Date & Time Info */}
                  <div className="bg-steel/5 rounded-xl p-3 space-y-1 font-mono text-xs border border-steel/10">
                    <div className="flex items-center justify-between text-ink font-semibold">
                      <span>Tanggal</span>
                      <span>{dt.toLocaleDateString("id-ID", { dateStyle: "medium" })}</span>
                    </div>
                    <div className="flex items-center justify-between text-ocean font-bold">
                      <span>Jam</span>
                      <span>{dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
                    </div>
                  </div>

                  {/* Meeting Link */}
                  {inv.meeting_link && (
                    <a
                      href={inv.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-sky/10 border border-sky/30 text-ocean p-2.5 rounded-xl font-mono text-xs font-bold hover:bg-sky/20 transition truncate"
                    >
                      <span className="truncate">Link Google Meet</span>
                      <svg className="w-3.5 h-3.5 shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {/* Notes */}
                  {inv.notes && (
                    <p className="font-sans text-[11px] text-steel italic bg-steel/5 p-2.5 rounded-xl border border-steel/10">
                      "{inv.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-steel/10 flex items-center gap-1.5 font-mono text-[11px]">
                  {isScheduled ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(inv)}
                        className="flex-1 rounded-full border border-steel/20 bg-white text-ink py-1.5 font-semibold hover:bg-steel/5 transition text-center"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inv.id, "Completed")}
                        className="flex-1 rounded-full bg-emerald-600 text-white py-1.5 font-semibold hover:bg-emerald-700 transition text-center shadow-sm"
                      >
                        Selesai
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inv.id, "Cancelled")}
                        className="rounded-full border border-rose-200 bg-rose-50 text-rose-700 px-2.5 py-1.5 font-semibold hover:bg-rose-100 transition"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(inv.id, "Scheduled")}
                      className="w-full rounded-full border border-steel/20 bg-white text-steel py-1.5 font-semibold hover:bg-steel/5 transition text-center"
                    >
                      Jadwalkan Ulang
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-steel/20">
            <div className="flex items-center justify-between border-b border-steel/10 pb-3 font-mono">
              <h3 className="font-display text-base font-bold text-ink">Edit Jadwal Wawancara</h3>
              <button onClick={() => setEditingInterview(null)} className="text-steel hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Tanggal Wawancara * (Min. H+2)</label>
                <input
                  type="date"
                  required
                  min={minEditDate}
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-xl border border-steel/20 px-3.5 py-2.5 outline-none focus:border-bridge-gold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Jam Wawancara *</label>
                <input
                  type="time"
                  required
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full rounded-xl border border-steel/20 px-3.5 py-2.5 outline-none focus:border-bridge-gold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Link Meeting *</label>
                <input
                  type="url"
                  required
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full rounded-xl border border-steel/20 px-3.5 py-2.5 outline-none focus:border-bridge-gold bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full rounded-xl border border-steel/20 px-3.5 py-2.5 outline-none focus:border-bridge-gold bg-white leading-relaxed font-sans"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingInterview(null)}
                  className="rounded-full border border-steel/20 px-5 py-2 text-steel hover:bg-steel/5 transition font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="rounded-full bg-ocean text-white px-6 py-2 font-bold hover:bg-ink transition disabled:opacity-40 shadow-sm"
                >
                  {isSavingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
