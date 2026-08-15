"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { companyService } from "./services/companyServices";
import { pelamarService } from "../pelamar/services/pelamarService";
import { StoredCompany, KolaborasiWithMeta } from "./types/company";
import { PelamarDetail } from "../pelamar/types/pelamar";
import { PerusahaanSkeletonPage } from "@/components/ui/MahasiswaLoading";
import { InteractiveCalendar, CalendarEvent } from "@/components/ui/InteractiveCalendar";

import { supabase } from "@/lib/supabase";

interface RecentPelamar extends PelamarDetail {
  kolaborasi_judul: string;
}

const NEO_CARD = "shadow-[8px_8px_22px_rgba(151,184,216,0.35),-8px_-8px_22px_rgba(255,255,255,0.9)]";
const NEO_CARD_HOVER = "hover:shadow-[10px_10px_28px_rgba(151,184,216,0.45),-10px_-10px_28px_rgba(255,255,255,0.95)]";
const NEO_INSET = "shadow-[inset_3px_3px_8px_rgba(151,184,216,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]";

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<StoredCompany | null>(null);
  const [kolaborasiList, setKolaborasiList] = useState<KolaborasiWithMeta[]>([]);
  const [recentPelamar, setRecentPelamar] = useState<RecentPelamar[]>([]);
  const [interviewsList, setInterviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setIsLoading(true);
      try {
        const compData = await companyService.fetchCompanyProfile();
        if (!isMounted) return;
        setCompany(compData);

        if (compData) {
          const [kolaborasiData, proyekPelamar, interviewsRes] = await Promise.all([
            companyService.fetchKolaborasiList(compData.user_id),
            pelamarService.fetchProyekDanPelamar(compData.user_id),
            supabase
              .from("interviews")
              .select("*, mahasiswa_profiles(nama_lengkap, foto_url), kolaborasi(judul)")
              .eq("perusahaan_id", compData.user_id)
              .order("scheduled_at", { ascending: true }),
          ]);
          if (!isMounted) return;

          setKolaborasiList(kolaborasiData);
          setInterviewsList(interviewsRes.data || []);

          const flatPelamar: RecentPelamar[] = proyekPelamar.flatMap((proyek) =>
            proyek.pelamar_list.map((p) => ({ ...p, kolaborasi_judul: proyek.judul }))
          );
          flatPelamar.sort(
            (a, b) => new Date(b.tanggal_daftar).getTime() - new Date(a.tanggal_daftar).getTime()
          );
          setRecentPelamar(flatPelamar);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const companyName = company?.nama_perusahaan || "Perusahaan Mitra";
  const isVerified = company?.status_verifikasi === "Terverifikasi";

  // Statistik
  const totalPelamar = recentPelamar.length;
  const menungguReview = recentPelamar.filter((p) => p.status === "Menunggu").length;
  const diterima = recentPelamar.filter((p) => p.status === "Diterima").length;
  const selesai = recentPelamar.filter((p) => p.status === "Selesai").length;
  const successRate =
    kolaborasiList.length > 0 ? Math.round((selesai / kolaborasiList.length) * 100) : 0;

  const kelolaPelamarHref = useMemo(() => {
    if (kolaborasiList.length === 0) return "/perusahaan/kolaborasi";
    const withPending = kolaborasiList.find((k) =>
      recentPelamar.some((p) => p.kolaborasi_id === k.id && p.status === "Menunggu")
    );
    const target = withPending || kolaborasiList[0];
    return `/perusahaan/kolaborasi/${target.id}?tab=pelamar`;
  }, [kolaborasiList, recentPelamar]);

  const formatTanggal = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "-";

  const companyCalendarEvents = useMemo<CalendarEvent[]>(() => {
    const list: CalendarEvent[] = [];

    kolaborasiList.forEach((k) => {
      if (k.batas_waktu) {
        list.push({
          id: `deadline-${k.id}`,
          date: k.batas_waktu,
          title: `Start Kolaborasi: ${k.judul}`,
          type: "deadline",
          typeLabel: "Start Kolaborasi",
          subtitle: `Slot: ${k.current_slot ?? k.slot ?? 0} / ${k.slot || 0}`,
          link: `/perusahaan/kolaborasi/${k.id}`,
        });
      }

      if (k.tanggal_selesai) {
        list.push({
          id: `completion-${k.id}`,
          date: k.tanggal_selesai,
          title: `Batas Pelaksanaan: ${k.judul}`,
          type: "completion",
          typeLabel: "Batas Pelaksanaan",
          subtitle: `Tipe: ${k.tipe}`,
          link: `/perusahaan/kolaborasi/${k.id}`,
        });
      }
    });

    interviewsList.forEach((inv) => {
      if (inv.scheduled_at) {
        const dt = new Date(inv.scheduled_at);
        const colabLink = inv.kolaborasi_id
          ? `/perusahaan/kolaborasi/${inv.kolaborasi_id}?tab=pelamar`
          : `/perusahaan/jadwal`;

        list.push({
          id: `interview-${inv.id}`,
          date: dt.toISOString().split("T")[0],
          title: `Wawancara: ${inv.mahasiswa_profiles?.nama_lengkap || "Pelamar"}`,
          type: "interview",
          typeLabel: "Wawancara",
          subtitle: `Proyek: ${inv.kolaborasi?.judul || "Kolaborasi"} (${dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB)`,
          link: colabLink,
        });
      }
    });

    return list;
  }, [kolaborasiList, interviewsList]);

  if (isLoading) return <PerusahaanSkeletonPage />;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-white p-15 sm:p-17 text-ink ${NEO_CARD}`}>
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#97B8D8]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="rounded-full bg-[#D6E7F3] px-3 py-1 font-mono text-xs font-semibold text-[#12284B] border border-[#C3DAEC]">
                Portal Perusahaan Mitra
              </span>
              <span className="font-mono text-xs text-steel">
                {company?.nama_sektor || "Teknologi & Produk Digital"}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Selamat Datang, <span className="text-[#4A7DA6]">{companyName}</span>
            </h1>
            <p className="mt-2 text-steel max-w-xl text-sm leading-relaxed">
              Buka peluang kolaborasi riset akademik dan magang untuk terhubung dengan mahasiswa
              berbakat dari berbagai universitas di Indonesia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {!isVerified ? (
              <button
                disabled
                title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F2F7FB] px-6 py-3.5 font-mono text-xs font-semibold text-steel/50 cursor-not-allowed"
              >
                <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                + Buka Peluang Baru (Menunggu Verifikasi)
              </button>
            ) : (
              <Link
                href="/perusahaan/kolaborasi/baru"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#97B8D8] px-6 py-3.5 font-medium text-[#12284B] transition hover:bg-[#ADC9E2] shadow-md text-sm font-semibold animate-fade-in"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                + Buka Peluang Baru
              </Link>
            )}

            {!isVerified ? (
              <button
                disabled
                title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#F2F7FB] px-6 py-3.5 font-mono text-xs font-medium text-steel/40 cursor-not-allowed ${NEO_INSET}`}
              >
                <svg className="h-3.5 w-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Kelola Pelamar (Menunggu Verifikasi)
              </button>
            ) : (
              <Link
                href={kelolaPelamarHref}
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#F2F7FB] px-6 py-3.5 font-mono text-xs font-medium text-[#12284B] transition hover:bg-[#E6F0F8] ${NEO_INSET}`}
              >
                Kelola Pelamar ({menungguReview})
              </Link>
            )}
          </div>
        </div>

        {/* Ringkasan Statistik */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E6F0F8] pt-8">
          <div className={`rounded-2xl bg-[#F2F7FB] p-4 ${NEO_INSET}`}>
            <p className="font-mono text-[10px] sm:text-xs text-steel uppercase tracking-wider">
              Total Pelamar
            </p>
            {isLoading ? (
              <div className="h-8 w-12 bg-white/60 rounded animate-pulse mt-1" />
            ) : (
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink animate-fade-in">
                {totalPelamar}
              </p>
            )}
          </div>
          <div className={`rounded-2xl bg-[#F2F7FB] p-4 ${NEO_INSET}`}>
            <p className="font-mono text-[10px] sm:text-xs text-steel uppercase tracking-wider">
              Menunggu Review
            </p>
            {isLoading ? (
              <div className="h-8 w-12 bg-white/60 rounded animate-pulse mt-1" />
            ) : (
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-amber-500 animate-fade-in">
                {menungguReview}
              </p>
            )}
          </div>
          <div className={`rounded-2xl bg-[#F2F7FB] p-4 ${NEO_INSET}`}>
            <p className="font-mono text-[10px] sm:text-xs text-steel uppercase tracking-wider">
              Diterima
            </p>
            {isLoading ? (
              <div className="h-8 w-12 bg-white/60 rounded animate-pulse mt-1" />
            ) : (
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-emerald-600 animate-fade-in">
                {diterima}
              </p>
            )}
          </div>
          <div className={`rounded-2xl bg-[#F2F7FB] p-4 col-span-2 sm:col-span-1 ${NEO_INSET}`}>
            <p className="font-mono text-[10px] sm:text-xs text-steel uppercase tracking-wider">
              Success Rate
            </p>
            {isLoading ? (
              <div className="h-8 w-12 bg-white/60 rounded animate-pulse mt-1" />
            ) : (
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink animate-fade-in">
                {successRate}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section Analytics & Visualisasi Konversi */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri 2-Span: Analytics & Interviews */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-3xl bg-white p-6 ${NEO_CARD}`}>
            <div className="flex items-center justify-between border-b border-[#E6F0F8] pb-4 mb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Analytics Konversi Pelamar</h2>
                <p className="font-mono text-xs text-steel">Distribusi status pendaftar pada seluruh proyek aktif</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Total {totalPelamar} Pelamar
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1 text-ink">
                  <span>Menunggu Review ({menungguReview})</span>
                  <span>{totalPelamar ? Math.round((menungguReview / totalPelamar) * 100) : 0}%</span>
                </div>
                <div className="h-3 w-full bg-steel/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${totalPelamar ? (menungguReview / totalPelamar) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-ink">
                  <span>Diterima &amp; Berjalan ({diterima})</span>
                  <span>{totalPelamar ? Math.round((diterima / totalPelamar) * 100) : 0}%</span>
                </div>
                <div className="h-3 w-full bg-steel/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalPelamar ? (diterima / totalPelamar) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-ink">
                  <span>Selesai ({selesai})</span>
                  <span>{totalPelamar ? Math.round((selesai / totalPelamar) * 100) : 0}%</span>
                </div>
                <div className="h-3 w-full bg-steel/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalPelamar ? (selesai / totalPelamar) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl bg-white p-6 ${NEO_CARD}`}>
            <div className="flex items-center justify-between border-b border-[#E6F0F8] pb-4 mb-4">
              <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                <svg className="w-4 h-4 text-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Jadwal Wawancara Mendatang
              </h2>
              <span className="font-mono text-[11px] font-bold text-ocean bg-sky/10 px-2.5 py-0.5 rounded-full">
                {interviewsList.length} Total
              </span>
            </div>

            {interviewsList.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-steel">
                Belum ada wawancara yang dijadwalkan.
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {interviewsList.map((inv) => (
                  <div key={inv.id} className="rounded-2xl border border-steel/15 bg-steel/5 p-3.5 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between font-bold text-ink">
                      <span className="truncate max-w-[140px]">
                        {inv.mahasiswa_profiles?.nama_lengkap || "Mahasiswa"}
                      </span>
                      <span className="text-[10px] text-ocean bg-sky/15 px-2 py-0.5 rounded-md">
                        {new Date(inv.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-steel truncate">Proyek: {inv.kolaborasi?.judul || "-"}</p>
                    <p className="text-[10px] text-steel/70">{new Date(inv.scheduled_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}</p>
                    {inv.meeting_link && (
                      <a
                        href={inv.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[10px] font-bold text-ocean underline truncate pt-0.5 hover:text-ink"
                      >
                        {inv.meeting_link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan 1-Span: Kalender Agenda Compact */}
        <div className="lg:col-span-1">
          <InteractiveCalendar events={companyCalendarEvents} title="Kalender Agenda" />
        </div>
      </section>

      {/* Section Aktivitas Terbaru (Pelamar) */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Aktivitas Terbaru
            </h2>
            <p className="font-mono text-xs text-steel mt-0.5">
              Pelamar terbaru dari proyek kolaborasi yang Anda buka
            </p>
          </div>

          <Link
            href="/perusahaan/pelamar"
            className="font-mono text-xs text-[#4A7DA6] font-medium hover:underline"
          >
            Lihat Semua Pelamar →
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/60" />
            ))}
          </div>
        ) : recentPelamar.length === 0 ? (
          <div className={`mt-6 rounded-2xl bg-white p-12 text-center animate-fade-in ${NEO_CARD}`}>
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D6E7F3] text-[#4A7DA6] ${NEO_INSET}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              Belum Ada Pelamar
            </h3>
            <p className="mt-1 text-sm text-steel">
              Pelamar akan muncul di sini setelah mahasiswa mendaftar ke peluang kolaborasi Anda.
            </p>
            <Link
              href="/perusahaan/kolaborasi"
              className="mt-6 inline-block rounded-full bg-[#97B8D8] px-6 py-2.5 font-mono text-xs font-medium text-[#12284B] transition hover:bg-[#ADC9E2]"
            >
              Kelola Kolaborasi
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3 animate-fade-in">
            {recentPelamar.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 transition-all duration-300 ${NEO_CARD} ${NEO_CARD_HOVER} hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#97B8D8] font-display text-sm font-bold text-[#12284B]">
                    {p.nama_lengkap?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-ink leading-snug">
                      {p.nama_lengkap}
                    </p>
                    <p className="text-xs text-steel truncate">
                      {p.universitas} · {p.program_studi}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1 pl-[52px] sm:pl-0 shrink-0">
                  <p className="font-mono text-[10px] text-steel/60 uppercase tracking-wider">
                    Proyek
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-sm font-bold text-ink truncate max-w-[220px]">
                      {p.kolaborasi_judul}
                    </p>
                    <span className="font-mono text-[11px] text-steel/60 whitespace-nowrap">
                      {formatTanggal(p.tanggal_daftar)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] font-semibold whitespace-nowrap ${
                        p.status === "Diterima"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.status === "Ditolak"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <Link
                    href={`/perusahaan/kolaborasi/${p.kolaborasi_id}`}
                    className="font-mono text-[11px] text-[#4A7DA6] font-medium hover:underline"
                  >
                    Lihat Detail ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
