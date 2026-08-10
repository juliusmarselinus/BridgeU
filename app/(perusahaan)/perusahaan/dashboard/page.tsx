"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import Link from "next/link";
import { dummyKolaborasi, dummyPelamarList, Kolaborasi, Pelamar } from "@/lib/dummy-data";
import { supabase } from "@/lib/supabase";

type StoredCompany = {
  nama: string;
  industri: string;
  email: string;
};

type KolaborasiStatus = "Terbit" | "Draft" | "Selesai";

// Omit statusPublikasi dan kuota agar tidak bentrok dengan tipe induk di dummy-data.ts
interface KolaborasiWithMeta extends Omit<Kolaborasi, "statusPublikasi" | "kuota"> {
  kuota?: number;
  statusPublikasi?: KolaborasiStatus;
}

const emptyFormData = {
  judul: "",
  tipe: "Akademik" as "Akademik" | "Magang",
  kategori: "Riset & Pengembangan",
  deskripsi: "",
  lokasi: "Remote",
  batasWaktu: "",
  kuota: 5,
  statusPublikasi: "Terbit" as KolaborasiStatus,
};

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<StoredCompany | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [kolaborasiList, setKolaborasiList] = useState<KolaborasiWithMeta[]>([]);
  const [pelamarList, setPelamarList] = useState<Pelamar[]>([]);
  const [selectedTab, setSelectedTab] = useState<"Semua" | "Terbit" | "Draft" | "Selesai">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // State Modal Form (dipakai bareng buat Tambah & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    const init = async () => {
      // 1. Ambil user session
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);

      let resolvedCompanyName = "Nexora Digital";

      // 2. Ambil profil perusahaan dari DB
      if (uid) {
        const { data: profile } = await supabase
          .from("perusahaan_profiles")
          .select("nama_perusahaan, sektor:sektor_id(nama_sektor)")
          .eq("user_id", uid)
          .maybeSingle();
        if (profile) {
          resolvedCompanyName = profile.nama_perusahaan;
          setCompany({
            nama: profile.nama_perusahaan,
            industri: (profile.sektor as any)?.nama_sektor ?? "-",
            email: session?.user?.email ?? "-",
          });
        }
      } else {
        // Fallback: localStorage
        const storedCompany = localStorage.getItem("bridgeu_company");
        if (storedCompany) {
          try {
            const parsed = JSON.parse(storedCompany);
            setCompany(parsed);
            resolvedCompanyName = parsed.nama;
          } catch (e) { console.error(e); }
        } else {
          setCompany({ nama: "Nexora Digital", industri: "Teknologi & Produk Digital", email: "perusahaan@nexora.com" });
        }
      }

      // 3. Ambil kolaborasi dari Supabase
      let currentKolaborasiList: KolaborasiWithMeta[] = [];
      if (uid) {
        const { data: rows } = await supabase
          .from("kolaborasi")
          .select(`id, judul, tipe, deskripsi, status_moderasi, batas_waktu, slot,
            kategori:kategori_id(nama_kategori),
            kota:lokasi_id(nama_kota)`)
          .eq("perusahaan_id", uid)
          .order("created_at", { ascending: false });

        if (rows && rows.length > 0) {
          currentKolaborasiList = rows.map((r: any) => ({
            id: r.id,
            judul: r.judul,
            tipe: r.tipe === "Magang" ? "Magang" : "Akademik",
            kategori: r.kategori?.nama_kategori ?? "-",
            deskripsi: r.deskripsi ?? "",
            perusahaan: resolvedCompanyName,
            lokasi: r.kota?.nama_kota ?? "-",
            batasWaktu: r.batas_waktu
              ? new Date(r.batas_waktu).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
              : "-",
            statusPublikasi: r.status_moderasi === "Disetujui" ? "Terbit"
              : r.status_moderasi === "Ditolak" ? "Draft" : "Draft",
            kuota: r.slot ?? 5,
          }));
          setKolaborasiList(currentKolaborasiList);
        } else {
          setKolaborasiList([]);
        }
      } else {
        // Fallback localStorage
        const storedKolaborasi = localStorage.getItem("bridgeu_company_kolaborasi");
        if (storedKolaborasi) {
          try {
            currentKolaborasiList = JSON.parse(storedKolaborasi);
            setKolaborasiList(currentKolaborasiList);
          } catch (e) { console.error(e); }
        } else {
          currentKolaborasiList = dummyKolaborasi.filter((k) => k.perusahaan.toLowerCase().includes("nexora")) as KolaborasiWithMeta[];
          setKolaborasiList(currentKolaborasiList);
        }
      }

      // 4. Pelamar
      if (uid && currentKolaborasiList.length > 0) {
        const colabIds = currentKolaborasiList.map((k) => k.id);
        const { data: pelamarRows, error: pelamarError } = await supabase
          .from("pendaftaran_kolaborasi")
          .select(`
            id,
            kolaborasi_id,
            status,
            tanggal_daftar,
            catatan_perusahaan,
            mahasiswa_profiles:mahasiswa_id(
              nama_lengkap,
              universitas:universitas_id(nama_universitas),
              prodi:prodi_id(nama_prodi),
              users:users!user_id(email)
            ),
            kolaborasi:kolaborasi_id(judul)
          `)
          .in("kolaborasi_id", colabIds);

        if (pelamarError) {
          console.error("Gagal mengambil pendaftaran_kolaborasi:", pelamarError.message);
        }

        if (pelamarRows && pelamarRows.length > 0) {
          const mappedPelamar: Pelamar[] = pelamarRows.map((p: any) => ({
            id: p.id,
            kolaborasiId: p.kolaborasi_id,
            kolaborasiJudul: p.kolaborasi?.judul ?? "-",
            namaMahasiswa: p.mahasiswa_profiles?.nama_lengkap ?? "Mahasiswa",
            universitas: p.mahasiswa_profiles?.universitas?.nama_universitas ?? "-",
            prodi: p.mahasiswa_profiles?.prodi?.nama_prodi ?? "-",
            emailMahasiswa: p.mahasiswa_profiles?.users?.email ?? "-",
            tujuan: p.catatan_perusahaan ?? "-",
            status: p.status,
            tanggal: p.tanggal_daftar
              ? new Date(p.tanggal_daftar).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
              : "-",
          }));
          setPelamarList(mappedPelamar);
        } else {
          setPelamarList([]);
        }
      } else {
        const storedPelamar = localStorage.getItem("bridgeu_pelamar_list");
        if (storedPelamar) {
          try { setPelamarList(JSON.parse(storedPelamar)); } catch (e) { console.error(e); }
        } else {
          setPelamarList(dummyPelamarList);
        }
      }
    };

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companyName = company?.nama || "Nexora Digital";
  const myKolaborasi =
    kolaborasiList.length > 0
      ? kolaborasiList
      : (dummyKolaborasi.filter(
          (k) => k.perusahaan === companyName || k.id === "1"
        ) as KolaborasiWithMeta[]);

  // Statistik
  const totalPelamar = pelamarList.length;
  const MenungguReview = pelamarList.filter((p) => p.status === "Menunggu").length;
  const Diterima = pelamarList.filter((p) => p.status === "Diterima").length;
  const Selesai = pelamarList.filter((p) => p.status === "Selesai").length;
  const successRate =
    myKolaborasi.length > 0 ? Math.round((Selesai / myKolaborasi.length) * 100) : 0;

  // Filter Tab + Search
  const filteredKolaborasi = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return myKolaborasi.filter((item) => {
      const status = item.statusPublikasi || "Terbit";
      const matchesTab = selectedTab === "Semua" || status === selectedTab;

      if (!matchesTab) return false;
      if (!q) return true;

      const haystack = [item.judul, item.kategori, item.tipe, item.lokasi]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [myKolaborasi, selectedTab, searchQuery]);

  // Hapus Proyek
  const handleDeleteKolaborasi = async (id: string, judul: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${judul}"?`)) return;
    // Hapus dari Supabase jika ada session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from("kolaborasi").delete().eq("id", id).eq("perusahaan_id", session.user.id);
    }
    setKolaborasiList((prev) => prev.filter((k) => k.id !== id));
  };

  // Buka Modal buat Tambah Baru
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(emptyFormData);
    setIsModalOpen(true);
  };

  // Buka Modal buat Edit Proyek yang Sudah Ada
  const handleOpenEditModal = (item: KolaborasiWithMeta) => {
    setEditingId(item.id);
    setFormData({
      judul: item.judul,
      tipe: item.tipe as "Akademik" | "Magang",
      kategori: item.kategori,
      deskripsi: item.deskripsi || "",
      lokasi: item.lokasi,
      batasWaktu: item.batasWaktu,
      kuota: item.kuota || 5,
      statusPublikasi: item.statusPublikasi || "Terbit",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  // Submit Modal Form (Tambah ATAU Edit)
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Resolve kategori_id dari kategori_minat
        let kategoriId: number | null = null;
        const { data: katRow } = await supabase
          .from("kategori_minat")
          .select("id")
          .eq("nama_kategori", formData.kategori)
          .maybeSingle();
        if (katRow) {
          kategoriId = katRow.id;
        } else {
          // Buat baru jika belum ada
          const { data: newKat } = await supabase
            .from("kategori_minat")
            .insert([{ nama_kategori: formData.kategori }])
            .select("id")
            .single();
          if (newKat) kategoriId = newKat.id;
        }

        // Resolve lokasi_id dari kota
        let lokasiId: number | null = null;
        const { data: kotaRow } = await supabase
          .from("kota")
          .select("id")
          .eq("nama_kota", formData.lokasi)
          .maybeSingle();
        if (kotaRow) {
          lokasiId = kotaRow.id;
        } else {
          const { data: newKota } = await supabase
            .from("kota")
            .insert([{ nama_kota: formData.lokasi }])
            .select("id")
            .single();
          if (newKota) lokasiId = newKota.id;
        }

        if (!kategoriId || !lokasiId) {
          alert("Gagal menyimpan: kategori atau lokasi tidak dapat diselesaikan.");
          setSubmitting(false);
          return;
        }

        const batasWaktuDate = formData.batasWaktu ? new Date(formData.batasWaktu).toISOString() : null;

        if (editingId) {
          // Mode Edit — UPDATE di Supabase
          await supabase.from("kolaborasi").update({
            judul: formData.judul,
            tipe: formData.tipe,
            kategori_id: kategoriId,
            deskripsi: formData.deskripsi,
            lokasi_id: lokasiId,
            batas_waktu: batasWaktuDate,
            slot: Number(formData.kuota),
            status_moderasi: formData.statusPublikasi === "Terbit" ? "Menunggu" : "Menunggu",
          }).eq("id", editingId).eq("perusahaan_id", session.user.id);

          setKolaborasiList((prev) =>
            prev.map((k) =>
              k.id === editingId
                ? { ...k, judul: formData.judul, tipe: formData.tipe, kategori: formData.kategori,
                    deskripsi: formData.deskripsi, lokasi: formData.lokasi,
                    batasWaktu: formData.batasWaktu, statusPublikasi: formData.statusPublikasi,
                    kuota: Number(formData.kuota) }
                : k
            )
          );
        } else {
          // Mode Tambah Baru — INSERT ke Supabase
          const { data: inserted, error: insertError } = await supabase
            .from("kolaborasi")
            .insert([{
              perusahaan_id: session.user.id,
              judul: formData.judul,
              tipe: formData.tipe,
              kategori_id: kategoriId,
              deskripsi: formData.deskripsi,
              lokasi_id: lokasiId,
              batas_waktu: batasWaktuDate,
              slot: Number(formData.kuota),
              status_moderasi: "Menunggu",
            }])
            .select("id")
            .single();

          if (insertError) {
            console.error("Gagal menyimpan kolaborasi:", insertError.message);
            alert(`Gagal menyimpan: ${insertError.message}`);
            setSubmitting(false);
            return;
          }

          const newItem: KolaborasiWithMeta = {
            id: inserted?.id ?? Date.now().toString(),
            judul: formData.judul,
            perusahaan: companyName,
            tipe: formData.tipe,
            kategori: formData.kategori,
            deskripsi: formData.deskripsi,
            lokasi: formData.lokasi,
            batasWaktu: formData.batasWaktu || "-",
            kuota: Number(formData.kuota),
            statusPublikasi: "Draft", // menunggu persetujuan admin
            tags: [formData.kategori, formData.tipe],
          };
          setKolaborasiList((prev) => [newItem, ...prev]);
        }
      } else {
        // Fallback localStorage (tidak ada session)
        if (editingId) {
          const updatedList = myKolaborasi.map((k) =>
            k.id === editingId
              ? { ...k, judul: formData.judul, tipe: formData.tipe, kategori: formData.kategori,
                  deskripsi: formData.deskripsi, lokasi: formData.lokasi,
                  batasWaktu: formData.batasWaktu || k.batasWaktu,
                  kuota: Number(formData.kuota), statusPublikasi: formData.statusPublikasi,
                  tags: [formData.kategori, formData.tipe] }
              : k
          );
          setKolaborasiList(updatedList);
          localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updatedList));
        } else {
          const newItem: KolaborasiWithMeta = {
            id: Date.now().toString(),
            judul: formData.judul,
            perusahaan: companyName,
            tipe: formData.tipe,
            kategori: formData.kategori,
            deskripsi: formData.deskripsi,
            lokasi: formData.lokasi,
            batasWaktu: formData.batasWaktu || "30 Des 2026",
            kuota: Number(formData.kuota),
            statusPublikasi: formData.statusPublikasi,
            tags: [formData.kategori, formData.tipe],
          };
          const updatedList = [newItem, ...myKolaborasi];
          setKolaborasiList(updatedList);
          localStorage.setItem("bridgeu_company_kolaborasi", JSON.stringify(updatedList));
        }
      }
    } catch (err: any) {
      console.error("Error submit kolaborasi:", err);
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setSubmitting(false);
      handleCloseModal();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Judul Proyek", "Tipe", "Kategori", "Lokasi", "Batas Waktu", "Status"];
    const rows = myKolaborasi.map((k) => [
      `"${k.judul}"`,
      k.tipe,
      k.kategori,
      `"${k.lokasi}"`,
      k.batasWaktu,
      k.statusPublikasi || "Terbit",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Kolaborasi_${companyName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-ink p-8 sm:p-10 text-paper shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-bridge-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-bridge-gold/20 px-3 py-1 font-mono text-xs font-semibold text-bridge-gold border border-bridge-gold/30">
                Portal Perusahaan Mitra
              </span>
              <span className="font-mono text-xs text-paper/60">
                {company?.industri || "Teknologi & Produk Digital"}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Selamat Datang, <span className="text-bridge-gold">{companyName}</span>
            </h1>
            <p className="mt-2 text-paper/70 max-w-xl text-sm leading-relaxed">
              Buka peluang kolaborasi riset akademik dan magang untuk terhubung dengan mahasiswa
              berbakat dari berbagai universitas di Indonesia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bridge-gold px-6 py-3.5 font-medium text-ink transition hover:bg-bridge-gold/90 shadow-lg shadow-bridge-gold/20 text-sm font-semibold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              + Buka Peluang Baru
            </button>
            <Link
              href="/perusahaan/pelamar"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-mono text-xs font-medium text-paper transition hover:bg-white/10"
            >
              Kelola Pelamar ({MenungguReview})
            </Link>
          </div>
        </div>

        {/* Ringkasan Statistik */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-white/10 pt-8">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Total Peluang
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-paper">
              {myKolaborasi.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Total Pelamar
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-bridge-gold">
              {totalPelamar}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Menunggu Review
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-yellow-400">
              {MenungguReview}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Diterima
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-emerald-400">
              {Diterima}
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5 col-span-2 sm:col-span-1">
            <p className="font-mono text-[10px] sm:text-xs text-paper/60 uppercase tracking-wider">
              Success Rate
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-blue-400">
              {successRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Section Peluang Kolaborasi */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Kelola Kolaborasi & Peluang
            </h2>
            <p className="font-mono text-xs text-steel mt-0.5">
              Daftar proyek akademik dan posisi magang yang Anda kelola
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-full border border-steel/20 bg-white px-4 py-2 font-mono text-xs font-medium text-ink transition hover:bg-steel/5 shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export CSV
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="font-mono text-xs text-bridge-gold font-medium hover:underline hidden sm:inline"
            >
              + Tambah Baru
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/50 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, kategori, tipe, atau lokasi proyek..."
            className="w-full rounded-full border border-steel/20 bg-white py-2.5 pl-11 pr-9 text-sm outline-none transition focus:border-bridge-gold focus:ring-1 focus:ring-bridge-gold"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-steel/50 hover:text-ink text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Filter */}
        <div className="mt-4 flex items-center gap-2 border-b border-steel/15 pb-3 font-mono text-xs overflow-x-auto">
          {(["Semua", "Terbit", "Draft", "Selesai"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`rounded-full px-4 py-1.5 font-medium transition whitespace-nowrap ${
                selectedTab === tab
                  ? "bg-ink text-paper"
                  : "text-steel hover:bg-steel/10"
              }`}
            >
              {tab === "Terbit" ? "Terbit (Aktif)" : tab === "Selesai" ? "Riwayat (Selesai)" : tab}
            </button>
          ))}
        </div>

        {/* Card Proyek */}
        {filteredKolaborasi.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-steel/30 bg-white/40 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bridge-gold/20 text-bridge-gold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              {searchQuery
                ? `Tidak ada hasil untuk "${searchQuery}"`
                : `Tidak Ada Peluang ${selectedTab !== "Semua" ? `dengan Status "${selectedTab}"` : ""}`}
            </h3>
            <p className="mt-1 text-sm text-steel">
              {searchQuery
                ? "Coba kata kunci lain atau reset pencarian."
                : "Mulai buat proyek kolaborasi akademik atau magang baru Anda."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-medium text-paper transition hover:bg-steel"
              >
                Reset Pencarian
              </button>
            ) : (
              <button
                onClick={handleOpenCreateModal}
                className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-medium text-paper transition hover:bg-steel"
              >
                Buat Kolaborasi Baru
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKolaborasi.map((item) => {
              const pelamarCount = pelamarList.filter(
                (p) => p.kolaborasiId === item.id || item.id === "1"
              ).length;
              const status = item.statusPublikasi || "Terbit";
              const kuota = item.kuota || 5;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-steel/15 bg-white/60 p-6 shadow-sm transition hover:shadow-md hover:border-bridge-gold/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-steel/10 px-3 py-1 font-mono text-[11px] font-medium text-steel">
                          {item.kategori}
                        </span>
                        <span className="rounded-full bg-bridge-gold/15 border border-bridge-gold/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
                          Slot: {pelamarCount}/{kuota}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                            status === "Draft"
                              ? "bg-gray-200 text-gray-700"
                              : status === "Selesai"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {status}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold ${
                            item.tipe === "Akademik"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.tipe}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-bold text-ink leading-snug">
                      {item.judul}
                    </h3>
                    <p className="mt-2 text-xs text-steel line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-steel/10 flex items-center justify-between font-mono text-xs text-steel">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {item.lokasi}
                      </span>
                      <span className="flex items-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        s.d {item.batasWaktu}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/perusahaan/pelamar?kolaborasiId=${item.id}`}
                        className="rounded-full bg-ink/10 px-3 py-1.5 font-medium text-ink hover:bg-ink hover:text-paper transition text-xs"
                      >
                        Pelamar ({pelamarCount})
                      </Link>

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="rounded-full bg-steel/10 p-1.5 text-steel hover:bg-steel/20 transition"
                        title="Edit Kolaborasi"
                      >
                        ✎
                      </button>

                      <button
                        onClick={() => handleDeleteKolaborasi(item.id, item.judul)}
                        className="rounded-full bg-red-50 p-1.5 text-red-500 hover:bg-red-100 transition"
                        title="Hapus Kolaborasi"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL POP-UP FORM (Tambah / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-steel/20 my-8">
            <div className="flex items-center justify-between border-b border-steel/10 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {editingId ? "Edit Peluang Kolaborasi" : "Buka Peluang Kolaborasi"}
                </h3>
                <p className="font-mono text-xs text-steel">
                  {editingId
                    ? "Perbarui detail proyek atau posisi magang ini"
                    : "Isi form di bawah untuk mempublikasikan proyek atau magang"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-xs font-medium text-ink mb-1">
                  Judul Proyek / Posisi Magang *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Optimasi Model AI untuk Klasifikasi Medis"
                  className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold focus:ring-1 focus:ring-bridge-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Tipe Kolaborasi
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipe: e.target.value as "Akademik" | "Magang",
                      })
                    }
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
                  >
                    <option value="Akademik">Akademik (Riset/Tugas Akhir)</option>
                    <option value="Magang">Magang (Proyek/Industri)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Kategori Proyek
                  </label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    placeholder="Contoh: Data Science, Software Eng"
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Lokasi Kerja
                  </label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Remote / Jakarta"
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Kuota Mahasiswa
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.kuota}
                    onChange={(e) => setFormData({ ...formData, kuota: Number(e.target.value) })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.statusPublikasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statusPublikasi: e.target.value as KolaborasiStatus,
                      })
                    }
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
                  >
                    <option value="Terbit">Terbit (Aktif)</option>
                    <option value="Draft">Draft</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-medium text-ink mb-1">
                  Batas Waktu Pendaftaran
                </label>
                <input
                  type="text"
                  value={formData.batasWaktu}
                  onChange={(e) => setFormData({ ...formData, batasWaktu: e.target.value })}
                  placeholder="Contoh: 15 Nov 2026"
                  className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-medium text-ink mb-1">
                  Deskripsi Proyek & Kualifikasi *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan kebutuhan proyek, ekspektasi luaran, serta skill mahasiswa yang dibutuhkan..."
                  className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-steel/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full px-5 py-2.5 font-mono text-xs font-medium text-steel hover:bg-steel/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-bridge-gold px-6 py-2.5 font-mono text-xs font-semibold text-ink hover:bg-bridge-gold/90 shadow-md transition"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan & Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}