"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { chatService, ChatMessage } from "@/app/(perusahaan)/perusahaan/kolaborasi/baru/services/chatService";
import { deleteRequestService } from "@/app/(perusahaan)/perusahaan/kolaborasi/baru/services/deleteRequestService";

import { ActionModal } from "@/components/ActionModal";

type StatusDetail = {
  id: string; // uuid pendaftaran_kolaborasi
  kolaborasi_id: string;
  judul: string;
  perusahaan: string;
  tipe: string;
  deskripsi: string;
  batasWaktu: string;
  status: "Menunggu" | "Diproses" | "Diterima" | "Evaluasi" | "Revisi" | "Ditolak" | "Selesai" | "Dibatalkan";
  tanggalDaftar: string;
  catatanPerusahaan?: string;
  urlPortofolioDokumen?: string;
  urlHasilKolaborasi?: string;
  catatanHasilKolaborasi?: string;
  tanggalPengumpulan?: string;
  ratings?: number | null;
  gajiStipend?: string;
  urlBuktiBayar?: string;
  statusPembayaran?: string;
};

type Tab = "timeline" | "pengumpulan" | "riwayat";

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconLink({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.41 1.41" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.41-1.41" />
    </svg>
  );
}

function IconMessage({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconSend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconX({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconFile({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function statusMeta(status: StatusDetail["status"]) {
  switch (status) {
    case "Evaluasi":
      return { label: "Sedang Dievaluasi", pill: "bg-amber-100 text-amber-800 border border-amber-300" };
    case "Revisi":
      return { label: "Perlu Revisi", pill: "bg-rose-100 text-rose-800 border border-rose-300" };
    case "Selesai":
      return { label: "Selesai", pill: "bg-emerald-100 text-emerald-800 border border-emerald-300" };
    case "Diterima":
    case "Diproses":
      return { label: "Pelaksanaan Aktif", pill: "bg-blue-100 text-blue-800 border border-blue-300" };
    case "Ditolak":
      return { label: "Ditolak", pill: "bg-rose-100 text-rose-800 border border-rose-300" };
    case "Dibatalkan":
      return { label: "Proyek Dibatalkan", pill: "bg-rose-100 text-rose-800 border border-rose-300" };
    default:
      return { label: "Menunggu Review", pill: "bg-steel/15 text-steel border border-steel/30" };
  }
}

export default function StatusDetailPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<StatusDetail | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  // Form Pengumpulan Hasil Pengerjaan
  const [urlHasil, setUrlHasil] = useState("");
  const [catatanHasil, setCatatanHasil] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // ====== CHAT STATE (REALTIME, TERSAMBUNG KE chatService) ======
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [processingHapusId, setProcessingHapusId] = useState<string | null>(null);
  const [hapusResponded, setHapusResponded] = useState<Record<string, "Disetujui" | "Ditolak">>({});
  const [currentUserId, setCurrentUserId] = useState<string>("");
  // ====== AKHIR CHAT STATE ======

  const [draftSaved, setDraftSaved] = useState(false);
  const [riwayatList, setRiwayatList] = useState<any[]>([]);
  const [infoPembatalan, setInfoPembatalan] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!id) return;
    const draft = localStorage.getItem(`bridgeu_draft_${id}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.urlHasil) setUrlHasil(parsed.urlHasil);
        if (parsed.catatanHasil) setCatatanHasil(parsed.catatanHasil);
      } catch (e) {
        console.error(e);
      }
    }
  }, [id]);

  const handleSaveDraft = () => {
    if (!id) return;
    localStorage.setItem(
      `bridgeu_draft_${id}`,
      JSON.stringify({ urlHasil, catatanHasil })
    );
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  // Ambil user auth mahasiswa yang sedang login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        if (id) {
          // Attempt 1: Fetch dari Supabase database berdasarkan id pendaftaran_kolaborasi
          const { data: row } = await supabase
            .from("pendaftaran_kolaborasi")
            .select(`
              id,
              kolaborasi_id,
              status,
              ratings,
              tanggal_daftar,
              catatan_perusahaan,
              url_portofolio_dokumen,
              url_bukti_bayar,
              status_pembayaran,
              kolaborasi:kolaborasi_id (
                judul,
                tipe,
                deskripsi,
                batas_waktu,
                gaji_stipend,
                perusahaan:perusahaan_id ( nama_perusahaan )
              ),
              riwayat_pengumpulan_kolaborasi (
                id,
                versi,
                url_hasil,
                catatan_mahasiswa,
                evaluasi_perusahaan,
                status_evaluasi,
                created_at
              )
            `)
            .eq("id", id as string)
            .maybeSingle();

          if (row) {
            const dbRiwayat = (row.riwayat_pengumpulan_kolaborasi || []).sort(
              (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            const latestSubmission = dbRiwayat[0] || null;

            const mapped: StatusDetail = {
              id: row.id,
              kolaborasi_id: row.kolaborasi_id,
              judul: (row.kolaborasi as any)?.judul ?? "Detail Kolaborasi",
              perusahaan: (row.kolaborasi as any)?.perusahaan?.nama_perusahaan ?? "Mitra Perusahaan",
              tipe: (row.kolaborasi as any)?.tipe ?? "Akademik",
              deskripsi: (row.kolaborasi as any)?.deskripsi ?? "",
              batasWaktu: (row.kolaborasi as any)?.batas_waktu
                ? new Date((row.kolaborasi as any).batas_waktu).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "-",
              status: row.status ?? "Menunggu",
              tanggalDaftar: row.tanggal_daftar
                ? new Date(row.tanggal_daftar).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })
                : "-",
              catatanPerusahaan: latestSubmission?.evaluasi_perusahaan || row.catatan_perusahaan,
              urlPortofolioDokumen: row.url_portofolio_dokumen,
              urlHasilKolaborasi: latestSubmission?.url_hasil,
              catatanHasilKolaborasi: latestSubmission?.catatan_mahasiswa,
              tanggalPengumpulan: latestSubmission?.created_at
                ? new Date(latestSubmission.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                  })
                : undefined,
              ratings: row.ratings != null ? Number(row.ratings) : null,
              gajiStipend: (row.kolaborasi as any)?.gaji_stipend ?? undefined,
              urlBuktiBayar: row.url_bukti_bayar ?? undefined,
              statusPembayaran: row.status_pembayaran ?? undefined,
            };

            setDetail(mapped);
            if (latestSubmission?.url_hasil) setUrlHasil(latestSubmission.url_hasil);
            if (latestSubmission?.catatan_mahasiswa) setCatatanHasil(latestSubmission.catatan_mahasiswa);
            setRiwayatList(dbRiwayat);
            if (mapped.status === "Dibatalkan") {
              const { data: permintaan } = await supabase
                .from("permintaan_hapus_kolaborasi")
                .select("catatan_perusahaan")
                .eq("kolaborasi_id", mapped.kolaborasi_id)
                .eq("status", "Selesai")
                .order("resolved_at", { ascending: false })
                .limit(1)
                .maybeSingle();
              if (permintaan?.catatan_perusahaan) {
                setInfoPembatalan(permintaan.catatan_perusahaan);
              }
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Gagal load status detail dari Supabase:", err);
      }

      // Fallback: localStorage
      const stored = localStorage.getItem("bridgeu_pengajuan");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const found = parsed.find((p: any, idx: number) => p.id === id || `local-${idx}` === id);
          if (found) {
            setDetail({
              id: found.id || (id as string),
              kolaborasi_id: found.id || "",
              judul: found.judul || "Pengajuan Kolaborasi",
              perusahaan: found.perusahaan || "Mitra",
              tipe: "Akademik",
              deskripsi: "Detail pendaftaran proyek kolaborasi.",
              batasWaktu: "-",
              status: found.status || "Menunggu",
              tanggalDaftar: found.tanggal || new Date().toLocaleDateString("id-ID"),
              catatanPerusahaan: found.catatan_perusahaan,
              urlPortofolioDokumen: found.portofolio,
              urlHasilKolaborasi: found.url_hasil_kolaborasi,
              catatanHasilKolaborasi: found.catatan_hasil_kolaborasi,
            });
            if (found.riwayat) setRiwayatList(found.riwayat);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }

    fetchDetail();
  }, [id]);

  // ====== REALTIME CHAT: fetch histori + subscribe pesan baru ======
  useEffect(() => {
    if (!detail?.kolaborasi_id || !currentUserId) {
      setChatMessages([]);
      return;
    }

    let isMounted = true;

    async function loadChat() {
      const msgs = await chatService.fetchPesan(detail!.kolaborasi_id, currentUserId);
      if (isMounted) setChatMessages(msgs);
    }

    loadChat();

    const channel = chatService.subscribe(
      detail.kolaborasi_id,
      currentUserId,
      (pesanBaru) => {
        if (pesanBaru.mahasiswa_id !== currentUserId) return;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === pesanBaru.id)) return prev;
          return [...prev, pesanBaru];
        });
      }
    );

    return () => {
      isMounted = false;
      chatService.unsubscribe(channel);
    };
  }, [detail?.kolaborasi_id, currentUserId]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !detail?.kolaborasi_id) return;

    let senderId = currentUserId;
    if (!senderId) {
      const { data } = await supabase.auth.getUser();
      senderId = data.user?.id || "";
    }
    if (!senderId) {
      setActionModal({
        isOpen: true,
        title: "Sesi Login Tidak Ditemukan",
        message: "Sesi login tidak ditemukan. Silakan refresh halaman.",
      });
      return;
    }

    const pesan = chatInput.trim();
    setChatInput("");
    setIsSendingChat(true);

    const newMsg = await chatService.kirim(
      detail.kolaborasi_id,
      senderId,
      senderId,
      "mahasiswa",
      pesan
      
    );

    setIsSendingChat(false);

    if (newMsg) {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    } else {
      setActionModal({
        isOpen: true,
        title: "Gagal Mengirim Pesan",
        message: "Gagal mengirim pesan. Coba lagi.",
      });
    }
  };

    const [hapusErrorId, setHapusErrorId] = useState<string | null>(null);

    const handleSetujuHapus = async (persetujuanId: string) => {
      setProcessingHapusId(persetujuanId);
      setHapusErrorId(null);
      const ok = await deleteRequestService.setujui(persetujuanId);
      setProcessingHapusId(null);
      if (ok !== false) {
        setHapusResponded((prev) => ({ ...prev, [persetujuanId]: "Disetujui" }));
      } else {
        setHapusErrorId(persetujuanId);
      }
    };

    const handleTolakHapus = async (persetujuanId: string) => {
      setProcessingHapusId(persetujuanId);
      setHapusErrorId(null);
      const ok = await deleteRequestService.tolak(persetujuanId);
      setProcessingHapusId(null);
      if (ok) {
        setHapusResponded((prev) => ({ ...prev, [persetujuanId]: "Ditolak" }));
      } else {
        setHapusErrorId(persetujuanId);
      }
    };

    
  // ====== AKHIR REALTIME CHAT ======

  const handleSubmitHasil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlHasil.trim()) return;

    setSubmitting(true);
    const nowIso = new Date().toISOString();

    try {
      if (detail?.id) {
        // 1. Insert ke tabel riwayat_pengumpulan_kolaborasi
        const nextVersi = riwayatList.length + 1;
        const { data: insertedRiwayat, error: riwayatErr } = await supabase
          .from("riwayat_pengumpulan_kolaborasi")
          .insert({
            pendaftaran_id: detail.id,
            versi: nextVersi,
            url_hasil: urlHasil,
            catatan_mahasiswa: catatanHasil,
            status_evaluasi: "Menunggu Evaluasi",
            created_at: nowIso,
          })
          .select()
          .single();

        if (riwayatErr) {
          console.error("Gagal insert riwayat_pengumpulan_kolaborasi:", riwayatErr.message);
        } else if (insertedRiwayat) {
          setRiwayatList((prev) => [insertedRiwayat, ...prev]);
        }

        // 2. Update status utama pendaftaran kolaborasi ke Evaluasi
        const { error: updateErr } = await supabase
          .from("pendaftaran_kolaborasi")
          .update({
            status: "Evaluasi",
            updated_at: nowIso,
          })
          .eq("id", detail.id);

        if (updateErr) {
          console.error("Gagal mengupdate status pendaftaran:", updateErr.message);
        }
      }
    } catch (err) {
      console.error("Error submitting project results:", err);
    }

    // Backup ke localStorage
    const stored = localStorage.getItem("bridgeu_pengajuan");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updatedLocal = parsed.map((p: any, idx: number) => {
          if (p.id === id || `local-${idx}` === id) {
            const currentRiwayat = p.riwayat || [];
            const newHistoryItem = {
              versi: currentRiwayat.length + 1,
              url_hasil: urlHasil,
              catatan_mahasiswa: catatanHasil,
              created_at: nowIso,
            };
            return {
              ...p,
              url_hasil_kolaborasi: urlHasil,
              catatan_hasil_kolaborasi: catatanHasil,
              status: "Evaluasi",
              riwayat: [newHistoryItem, ...currentRiwayat],
            };
          }
          return p;
        });
        localStorage.setItem("bridgeu_pengajuan", JSON.stringify(updatedLocal));
      } catch (e) { console.error(e); }
    }

    setDetail((prev) =>
      prev
        ? {
            ...prev,
            urlHasilKolaborasi: urlHasil,
            catatanHasilKolaborasi: catatanHasil,
            tanggalPengumpulan: new Date().toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            }),
            status: "Evaluasi",
          }
        : null
    );

    setSubmitting(false);
    if (id) localStorage.removeItem(`bridgeu_draft_${id}`);
    setSubmitSuccess(true);
    setActiveTab("riwayat");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center pt-24 pb-16">
        <div className="rounded-3xl border border-steel/15 bg-white p-8 text-center shadow-md">
          <div className="h-6 w-48 bg-steel/10 rounded-lg animate-pulse mx-auto mb-3" />
          <div className="h-3 w-32 bg-steel/10 rounded animate-pulse mx-auto" />
        </div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="min-h-screen bg-paper pt-24 pb-16 px-4">
        <div className="mx-auto max-w-md rounded-3xl border border-steel/20 bg-white p-8 text-center shadow-lg space-y-4">
          <h3 className="font-display text-xl font-bold text-ink">Pengajuan Tidak Ditemukan</h3>
          <p className="text-xs text-steel">Data pengajuan kolaborasi ini tidak ditemukan atau telah dihapus.</p>
          <Link
            href="/status"
            className="inline-block rounded-2xl bg-ink px-6 py-3 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md"
          >
            ← Kembali ke Status Pengajuan
          </Link>
        </div>
      </main>
    );
  }

  const isSubmitted = Boolean(detail.tanggalDaftar);
  const isAccepted = detail.status === "Diterima" || detail.status === "Diproses" || detail.status === "Evaluasi" || detail.status === "Revisi" || detail.status === "Selesai";
  const isCompleted = detail.status === "Selesai";
  const isRejected = detail.status === "Ditolak";
  const isPending = detail.status === "Menunggu";
  const meta = statusMeta(detail.status);
  function parseHapusProyekMarker(pesan: string) {
  const match = pesan.match(/^__HAPUS_PROYEK__(\{.*?\})__/);
  if (!match) return null;
  try {
    const data = JSON.parse(match[1]);
    const teksBersih = pesan.slice(match[0].length).trim();
    return { persetujuan_id: data.persetujuan_id as string, permintaan_id: data.permintaan_id as string, teksBersih };
  } catch {
    return null;
  }
}

  const timelineSteps = [
    {
      title: "Pendaftaran Berhasil",
      date: detail.tanggalDaftar,
      desc: `Formulir permohonan berhasil terdaftar pada ${detail.tanggalDaftar}.`,
      done: true,
    },
    {
      title: "Verifikasi & Seleksi",
      date: isAccepted || isRejected ? detail.tanggalDaftar : "Dalam Proses",
      desc: isRejected
        ? "Mitra perusahaan belum dapat menerima permohonan kolaborasi saat ini."
        : isAccepted
        ? `Permohonan telah disetujui oleh ${detail.perusahaan}. Kamu dapat mulai mengerjakan proyek.`
        : "Mitra perusahaan sedang mempelajari kesesuaian data diri dan motivasi kamu.",
      done: isAccepted,
      error: isRejected,
    },
    {
      title: "Pelaksanaan",
      date: detail.batasWaktu !== "-" ? `Batas: ${detail.batasWaktu}` : "Sedang Berlangsung",
      desc: detail.status === "Evaluasi"
        ? "Hasil pengerjaan kamu sedang ditinjau dan dievaluasi oleh mitra perusahaan."
        : detail.status === "Revisi"
        ? "Mitra perusahaan memberikan masukan. Silakan lakukan perbaikan dan kumpulkan revisi karya."
        : isCompleted
        ? "Hasil pengerjaan karya telah diperiksa dan disetujui akhir oleh mitra perusahaan."
        : isAccepted
        ? "Tahap pengerjaan proyek aktif. Unggah hasil karya kamu di tab Pengumpulan Karya."
        : "Area pengerjaan akan terbuka setelah permohonan disetujui mitra.",
      done: isCompleted,
      active: isAccepted && !isCompleted,
    },
    {
      title: "Evaluasi Akhir",
      date: isCompleted ? (detail.tanggalPengumpulan || "Selesai") : "Menunggu Pelaksanaan Selesai",
      desc: isCompleted
        ? "Kolaborasi telah sukses dilaksanakan dan poin reputasi telah diperbarui."
        : "Penilaian akhir oleh mitra perusahaan setelah karya disetujui.",
      done: isCompleted,
    },
  ];

  const currentStepIndex = isCompleted ? 4 : isRejected ? 2 : detail.status === "Evaluasi" || detail.status === "Revisi" ? 3 : isAccepted ? 3 : isSubmitted ? 2 : 1;

  const tabs: { key: Tab; label: string }[] = [
    { key: "timeline", label: "Timeline & Detail" },
    { key: "pengumpulan", label: "Pengumpulan Karya" },
    { key: "riwayat", label: `Riwayat & Evaluasi${riwayatList.length ? ` (${riwayatList.length})` : ""}` },
  ];

  return (
    <main className="min-h-screen bg-paper pt-24 pb-16 text-ink font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-stretch">
          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-24 space-y-4 flex flex-col">
            <div className="rounded-3xl border border-steel/15 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-16 bg-gradient-to-br from-ink via-ink to-steel" />
              <div className="p-6 -mt-8 space-y-4">
                <span className={`inline-block rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${meta.pill}`}>
                  {meta.label}
                </span>

                <div>
                  <h1 className="font-display text-xl font-black text-ink leading-tight">
                    {detail.judul}
                  </h1>
                  <p className="font-mono text-xs text-amber-700 font-bold mt-1">
                    {detail.perusahaan}
                  </p>
                </div>

                {detail.deskripsi && (
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-steel block mb-1">Deskripsi Proyek</span>
                    <p className="text-xs text-steel leading-relaxed">{detail.deskripsi}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-steel/10 font-mono text-[11px]">
                  <div>
                    <span className="text-steel block">Tipe Proyek</span>
                    <strong className="text-ink">{detail.tipe}</strong>
                  </div>
                  <div>
                    <span className="text-steel block">Tanggal Daftar</span>
                    <strong className="text-ink">{detail.tanggalDaftar}</strong>
                  </div>
                  {detail.tipe === "Magang" && detail.gajiStipend && (
                    <div className="col-span-2">
                      <span className="text-steel block">Gaji / Stipend</span>
                      <strong className="text-emerald-700 font-bold">{detail.gajiStipend}</strong>
                    </div>
                  )}
                  {detail.batasWaktu !== "-" && (
                    <div className="col-span-2">
                      <span className="text-steel block">Batas Pelaksanaan</span>
                      <strong className="text-ink">{detail.batasWaktu}</strong>
                    </div>
                  )}
                </div>

                {detail.tipe === "Magang" && (detail.urlBuktiBayar || detail.statusPembayaran) && (
                  <div className="rounded-2xl bg-sky/10 border border-sky/20 p-3 space-y-1 font-mono text-xs">
                    <span className="text-[10px] uppercase font-bold text-ocean block">Bukti Bayar & Pencairan Insentif</span>
                    <p className="text-xs text-ink font-bold">Status: {detail.statusPembayaran || "Tersedia"}</p>
                    {detail.urlBuktiBayar && (
                      <a
                        href={detail.urlBuktiBayar}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-1"
                      >
                        <IconLink className="w-3 h-3" />
                        Unduh / Lihat Bukti Bayar →
                      </a>
                    )}
                  </div>
                )}

                <div className="font-mono text-[11px] pt-2 border-t border-steel/10">
                  <span className="text-steel block">Tautan Portofolio</span>
                  {detail.urlPortofolioDokumen ? (
                    <a href={detail.urlPortofolioDokumen} target="_blank" rel="noreferrer" className="text-bridge-gold underline font-bold truncate block">
                      Lihat Portofolio →
                    </a>
                  ) : (
                    <span className="text-steel/60">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA klarifikasi */}
            <div className="rounded-3xl border border-steel/15 bg-white shadow-sm hover:shadow-md transition-shadow p-6 space-y-3 text-center flex-1 flex flex-col justify-center">
              <IconMessage className="w-5 h-5 text-steel mx-auto" />
              <p className="text-xs text-steel">Butuh klarifikasi lebih lanjut dengan mitra?</p>
              <button
                onClick={() => setChatOpen(true)}
                className="w-full rounded-2xl border border-ink/20 bg-paper px-4 py-2.5 font-mono text-xs font-bold text-ink hover:bg-ink hover:text-paper transition"
              >
                Kirim Pesan
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="space-y-5 flex flex-col">
            {/* Tabs */}
            <div className="rounded-3xl border border-steel/15 bg-white shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col">
              <div className="flex border-b border-steel/10 px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-4 font-mono text-xs font-bold transition border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? "border-bridge-gold text-ink"
                        : "border-transparent text-steel/60 hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8 flex-1">
                {/* TAB: TIMELINE & DETAIL */}
                {activeTab === "timeline" && (
                  <div className="space-y-6">
                    <div className="relative pl-7 space-y-7 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-steel/15">
                      {timelineSteps.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isDone = step.done;
                        const isActive = !isDone && stepNum === currentStepIndex;
                        return (
                          <div key={idx} className="relative flex items-start gap-4">
                            <span
                              className={`absolute -left-7 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                                step.error
                                  ? "bg-rose-100 text-rose-700 border-2 border-rose-400"
                                  : isDone
                                  ? "bg-ink text-paper"
                                  : isActive
                                  ? "bg-bridge-gold/20 text-bridge-gold border-2 border-bridge-gold"
                                  : "bg-paper text-steel/50 border-2 border-steel/25"
                              }`}
                            >
                              {step.error ? "✕" : isDone ? <IconCheck className="w-3.5 h-3.5" /> : stepNum}
                            </span>
                            <div className="space-y-1 w-full">
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <h3 className={`font-display text-sm font-bold ${step.error ? "text-rose-600" : isDone ? "text-ink" : isActive ? "text-ink" : "text-steel/50"}`}>
                                  {step.title}
                                </h3>
                                <span className="font-mono text-[10px] text-steel/60">{step.date}</span>
                              </div>
                              <p className="text-xs text-steel leading-relaxed">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {detail.status === "Selesai" && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                            Penilaian &amp; Performa dari Mitra
                          </span>
                          <span className="font-mono text-xs font-bold text-emerald-800">
                            {detail.ratings != null ? `${detail.ratings}.0 / 5.0` : "Belum Beri Rating"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 py-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-6 h-6 ${
                                (detail.ratings || 0) >= star ? "text-amber-400 fill-amber-400" : "text-emerald-200 fill-emerald-100"
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                          {detail.ratings != null
                            ? `Mitra ${detail.perusahaan} memberikan penilaian ${detail.ratings} dari 5 bintang untuk hasil kerja kamu.`
                            : `Mitra ${detail.perusahaan} belum menyertakan penilaian bintang untuk kolaborasi ini.`}
                        </p>
                      </div>
                    )}

                    {detail.catatanPerusahaan && (
                      <div className="rounded-2xl border border-bridge-gold/30 bg-bridge-gold/5 p-5 space-y-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-bridge-gold tracking-wider">
                          Evaluasi & Catatan Perusahaan
                        </span>
                        <p className="text-xs text-ink font-medium leading-relaxed italic">
                          &ldquo;{detail.catatanPerusahaan}&rdquo;
                        </p>
                        {infoPembatalan && (
                          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 space-y-2">
                            <span className="font-mono text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                              Proyek Dibatalkan oleh Perusahaan
                            </span>
                            <p className="text-xs text-rose-900 font-medium leading-relaxed">
                              {infoPembatalan}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: PENGUMPULAN KARYA */}
                {activeTab === "pengumpulan" && (
                  <div>
                    {isPending && (
                      <div className="rounded-2xl border border-steel/15 bg-paper/60 p-6 text-center space-y-2">
                        <span className="font-mono text-[11px] font-bold text-steel uppercase tracking-wider">
                          Menunggu Review
                        </span>
                        <p className="text-xs text-steel max-w-md mx-auto">
                          Tahap pengumpulan karya akan terbuka otomatis setelah pendaftaran kamu disetujui oleh pihak perusahaan.
                        </p>
                      </div>
                    )}

                    {isRejected && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-2">
                        <span className="font-mono text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                          Pendaftaran Tidak Dilanjutkan
                        </span>
                        <p className="text-xs text-rose-900 max-w-md mx-auto">
                          Mitra perusahaan belum dapat menerima permohonan kolaborasi ini.
                        </p>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="rounded-2xl border border-verified/30 bg-verified/5 p-6 space-y-3 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-verified/15">
                          <IconCheck className="h-5 w-5 text-verified" />
                        </div>
                        <h2 className="font-display text-lg font-bold text-ink">
                          Proyek Telah Selesai & Disetujui
                        </h2>
                        <p className="text-xs text-steel max-w-md mx-auto leading-relaxed">
                          Mitra perusahaan telah menyetujui hasil akhir pengerjaan karya kamu. Pengumpulan telah ditutup dan poin reputasi kamu telah ditambahkan.
                        </p>
                      </div>
                    )}

                    {!isPending && !isRejected && !isCompleted && (
                      <div className="space-y-5">
                        <div className="flex items-start gap-3 pb-4 border-b border-steel/10">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 shrink-0">
                            <IconFile className="w-4 h-4 text-ink" />
                          </div>
                          <div>
                            <h2 className="font-display text-base font-bold text-ink">
                              {detail.urlHasilKolaborasi ? "Kumpulkan Revisi Hasil Karya" : "Kumpulkan Hasil Pekerjaan"}
                            </h2>
                            <p className="text-xs text-steel mt-0.5">
                              Tahap pelaksanaan · Iterasi {riwayatList.length + 1}
                            </p>
                          </div>
                        </div>

                        {submitSuccess && (
                          <div className="rounded-2xl border border-verified/30 bg-verified/5 p-4 text-xs text-ink flex items-center gap-3">
                            <IconCheck className="w-5 h-5 text-verified shrink-0" />
                            <span>Hasil karya berhasil dikirim ke mitra perusahaan. Cek tab Riwayat & Evaluasi.</span>
                          </div>
                        )}

                        <form onSubmit={handleSubmitHasil} className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-ink mb-1.5">
                              Tautan URL Pekerjaan <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <IconLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-steel/50" />
                              <input
                                type="url"
                                required
                                value={urlHasil}
                                onChange={(e) => setUrlHasil(e.target.value)}
                                placeholder="https://github.com/username/project-hasil"
                                className="w-full rounded-2xl border border-steel/20 bg-paper pl-10 pr-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium"
                              />
                            </div>
                            <p className="text-[10px] text-steel/70 mt-1.5">Pastikan tautan dapat diakses publik oleh pihak perusahaan.</p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-ink mb-1.5">
                              Catatan Tambahan
                            </label>
                            <textarea
                              rows={4}
                              value={catatanHasil}
                              onChange={(e) => setCatatanHasil(e.target.value)}
                              placeholder="Jelaskan progres iterasi ini atau hal yang perlu diperhatikan..."
                              className="w-full rounded-2xl border border-steel/20 bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink transition font-medium resize-none"
                            />
                          </div>

                          {detail.urlHasilKolaborasi && (
                            <div className="rounded-2xl border border-steel/15 bg-steel/5 p-4 text-xs space-y-1">
                              <span className="font-mono text-[10px] uppercase font-bold text-steel">Pengumpulan Terakhir</span>
                              <a href={detail.urlHasilKolaborasi} target="_blank" rel="noreferrer" className="block text-bridge-gold font-bold underline truncate">
                                {detail.urlHasilKolaborasi}
                              </a>
                              {detail.tanggalPengumpulan && (
                                <p className="text-[10px] text-steel">Dikirim pada: {detail.tanggalPengumpulan}</p>
                              )}
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-end gap-3">
                            {draftSaved && (
                              <span className="font-mono text-[10px] text-verified font-bold">Draft tersimpan</span>
                            )}
                            <button
                              type="button"
                              onClick={handleSaveDraft}
                              className="rounded-2xl px-5 py-2.5 font-mono text-xs font-bold text-steel hover:text-ink transition"
                            >
                              Simpan Draft
                            </button>
                            <button
                              type="submit"
                              disabled={submitting || !urlHasil.trim()}
                              className="rounded-2xl bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? "Mengirim..." : "Kirim Iterasi →"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: RIWAYAT & EVALUASI */}
                {activeTab === "riwayat" && (
                  <div className="space-y-4">
                    {riwayatList.length === 0 ? (
                      <div className="rounded-2xl border border-steel/15 bg-paper/60 p-8 text-center">
                        <p className="text-xs text-steel">Belum ada riwayat pengumpulan karya untuk kolaborasi ini.</p>
                      </div>
                    ) : (
                      riwayatList.map((item, idx) => {
                        const itemDate = item.created_at
                          ? new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })
                          : "-";
                        const hasEvaluasi = Boolean(item.evaluasi_perusahaan);

                        return (
                          <div
                            key={item.id || idx}
                            className={`rounded-2xl border bg-white p-5 space-y-3 border-l-4 ${
                              hasEvaluasi ? "border-l-rose-400 border-steel/15" : "border-l-steel/30 border-steel/15"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-ink text-sm">
                                  Iterasi {item.versi || riwayatList.length - idx}
                                </span>
                                {hasEvaluasi && (
                                  <span className="rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
                                    Perlu Revisi
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[10px] text-steel">Dikirim {itemDate}</span>
                            </div>

                            
                              <a href={item.url_hasil}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-bridge-gold font-bold underline truncate text-xs"
                            >
                              <IconLink className="w-3.5 h-3.5 shrink-0" />
                              Tautan Kiriman
                            </a>

                            {item.catatan_mahasiswa && (
                              <p className="text-ink font-sans text-xs italic bg-paper/60 p-3 rounded-xl border border-steel/10">
                                &ldquo;{item.catatan_mahasiswa}&rdquo;
                              </p>
                            )}

                            {hasEvaluasi && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] uppercase font-bold text-rose-700 block">Catatan Ulasan Perusahaan</span>
                                <p className="text-rose-900 font-sans text-xs bg-rose-50 p-3 rounded-xl border border-rose-200">
                                  &ldquo;{item.evaluasi_perusahaan}&rdquo;
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT MODAL */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 p-0 sm:p-4"
          onClick={() => setChatOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md h-[85vh] sm:h-[600px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-steel/10 bg-gradient-to-br from-ink to-steel text-paper">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/15 font-mono text-xs font-bold">
                  {detail.perusahaan.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-display text-sm font-bold">{detail.perusahaan}</p>
                  <p className="font-mono text-[10px] text-paper/70">{detail.judul}</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-paper/10 transition"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-paper/40">
              {chatMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center font-mono text-[11px] text-steel text-center px-6">
                  Belum ada pesan. Kirim pesan pertama ke {detail.perusahaan}.
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.tipe_pengirim === "mahasiswa";
                  const time = new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                  const hapusInfo = parseHapusProyekMarker(msg.pesan);
                  const responded = hapusInfo ? hapusResponded[hapusInfo.persetujuan_id] : undefined;

                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? "bg-ink text-paper rounded-br-sm"
                          : hapusInfo
                          ? "bg-rose-50 text-ink border border-rose-200 rounded-bl-sm"
                          : "bg-white text-ink border border-steel/15 rounded-bl-sm"
                      }`}>
                        {hapusInfo && (
                          <p className="font-mono text-[9px] uppercase font-bold text-rose-600 mb-1.5 tracking-wider">
                            Permintaan Pembatalan Proyek
                          </p>
                        )}
                        <p className="whitespace-pre-line">{hapusInfo ? hapusInfo.teksBersih : msg.pesan}</p>

                        {hapusInfo && !responded && (
                            <div className="mt-3 space-y-2">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSetujuHapus(hapusInfo.persetujuan_id)}
                                  disabled={processingHapusId === hapusInfo.persetujuan_id}
                                  className="flex-1 rounded-full bg-emerald-600 text-white px-3 py-1.5 font-mono text-[10px] font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                  {processingHapusId === hapusInfo.persetujuan_id ? "..." : "Setuju"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleTolakHapus(hapusInfo.persetujuan_id)}
                                  disabled={processingHapusId === hapusInfo.persetujuan_id}
                                  className="flex-1 rounded-full border border-steel/30 text-ink px-3 py-1.5 font-mono text-[10px] font-bold hover:bg-steel/10 transition disabled:opacity-50"
                                >
                                  Tidak Setuju
                                </button>
                              </div>
                              {hapusErrorId === hapusInfo.persetujuan_id && (
                                <p className="font-mono text-[10px] text-red-600 font-bold">Gagal mengirim respons. Coba lagi.</p>
                              )}
                            </div>
                          )}

                        {hapusInfo && responded && (
                          <p className={`mt-2.5 font-mono text-[10px] font-bold ${responded === "Disetujui" ? "text-emerald-700" : "text-rose-700"}`}>
                            {responded === "Disetujui" ? "✓ Kamu sudah menyetujui" : "✕ Kamu menolak permintaan ini"}
                          </p>
                        )}

                        <p className={`font-mono text-[9px] mt-1 ${isMe ? "text-paper/60" : "text-steel/60"}`}>
                          {time}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}  
            </div>

            {/* Input */}
            <form onSubmit={handleSendChat} className="flex items-center gap-2 px-4 py-3 border-t border-steel/10 bg-white">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-1 rounded-full border border-steel/20 bg-paper px-4 py-2.5 text-xs text-ink outline-none focus:border-ink transition"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper hover:bg-steel transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconSend className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <ActionModal
        isOpen={actionModal.isOpen}
        title={actionModal.title}
        message={actionModal.message}
        onClose={() => setActionModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}