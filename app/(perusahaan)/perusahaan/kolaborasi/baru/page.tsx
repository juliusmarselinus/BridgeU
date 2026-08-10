"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { companyService, companyServiceExtended } from "../../dashboard/services/companyServices";
import { KategoriMinatOption, KotaOption } from "../../dashboard/types/company";

interface ProdiOption {
  id: number;
  nama_prodi: string;
  jenjang: string;
}

interface SkillOption {
  id: number;
  nama_skill: string;
}

export default function TambahKolaborasiPage() {
  const router = useRouter();
  const [perusahaanId, setPerusahaanId] = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Master Options
  const [kategoriList, setKategoriList] = useState<KategoriMinatOption[]>([]);
  const [kotaList, setKotaList] = useState<KotaOption[]>([]);
  const [prodiList, setProdiList] = useState<ProdiOption[]>([]);
  const [skillList, setSkillList] = useState<SkillOption[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    judul: "",
    tipe: "Akademik" as "Akademik" | "Magang",
    kategori_id: 1,
    lokasi_id: 1,
    tingkat_kesulitan: "Menengah" as "Pemula" | "Menengah" | "Lanjut",
    slot: 5,
    batas_waktu: "",
    gaji_stipend: "",
    deskripsi: "",
    selectedProdiIds: [] as number[],
    selectedSkillIds: [] as number[],
  });

  useEffect(() => {
    async function loadOptions() {
      setIsLoadingOptions(true);
      try {
        const [profile, categories, kotas, prodis, skills] = await Promise.all([
          companyService.fetchCompanyProfile(),
          companyService.fetchKategoriMinat(),
          companyService.fetchKotaList(),
          companyServiceExtended.fetchProdiList(),
          companyServiceExtended.fetchSkillsList(),
        ]);

        if (profile) {
          setPerusahaanId(profile.user_id);
        }

        setKategoriList(categories);
        setKotaList(kotas);
        setProdiList(prodis);
        setSkillList(skills);

        if (categories.length > 0) {
          setFormData((prev) => ({ ...prev, kategori_id: categories[0].id }));
        }
        if (kotas.length > 0) {
          setFormData((prev) => ({ ...prev, lokasi_id: kotas[0].id }));
        }
      } catch (err) {
        console.error("Gagal memuat opsi form:", err);
      } finally {
        setIsLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  // Checkbox Target Prodi Toggle
  const toggleProdi = (id: number) => {
    setFormData((prev) => {
      const exists = prev.selectedProdiIds.includes(id);
      return {
        ...prev,
        selectedProdiIds: exists
          ? prev.selectedProdiIds.filter((pId) => pId !== id)
          : [...prev.selectedProdiIds, id],
      };
    });
  };

  // Checkbox Skill Toggle
  const toggleSkill = (id: number) => {
    setFormData((prev) => {
      const exists = prev.selectedSkillIds.includes(id);
      return {
        ...prev,
        selectedSkillIds: exists
          ? prev.selectedSkillIds.filter((sId) => sId !== id)
          : [...prev.selectedSkillIds, id],
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!perusahaanId) {
      alert("Sesi profil perusahaan tidak ditemukan. Silakan login kembali.");
      return;
    }

    setIsSubmitting(true);

    const success = await companyServiceExtended.createFullKolaborasi(
      {
        judul: formData.judul,
        tipe: formData.tipe,
        kategori_id: formData.kategori_id,
        deskripsi: formData.deskripsi,
        lokasi_id: formData.lokasi_id,
        batas_waktu: formData.batas_waktu,
        tingkat_kesulitan: formData.tingkat_kesulitan,
        gaji_stipend: formData.gaji_stipend,
        slot: formData.slot,
        target_prodi_ids: formData.selectedProdiIds,
        skill_ids: formData.selectedSkillIds,
      },
      perusahaanId
    );

    setIsSubmitting(false);

    if (success) {
      alert("Proyek kolaborasi berhasil diajukan dan sedang dalam proses moderasi admin.");
      router.push("/perusahaan/kolaborasi");
    } else {
      alert("Gagal mempublikasikan proyek. Periksa kembali kelengkapan data.");
    }
  };

  if (isLoadingOptions) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat formulir pengajuan kolaborasi...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-16">
      {/* Header & Breadcrumb */}
      <div className="border-b border-steel/15 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-steel">
          <Link href="/perusahaan/kolaborasi" className="hover:text-ink transition">
            Kelola Kolaborasi
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">Buka Kolaborasi Baru</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          Buka Peluang Kolaborasi Baru
        </h1>
        <p className="mt-1 font-mono text-xs text-steel">
          Publikasikan proyek riset akademik atau posisi magang untuk dijangkau oleh mahasiswa
        </p>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Section 1: Informasi Dasar */}
        <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold text-ink border-b border-steel/10 pb-3">
            1. Informasi Utama Proyek
          </h2>

          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Judul Proyek / Lowongan Magang *
            </label>
            <input
              type="text"
              required
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Riset Implementasi AI untuk Optimasi Logistik"
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Tipe Kolaborasi *
              </label>
              <select
                value={formData.tipe}
                onChange={(e) =>
                  setFormData({ ...formData, tipe: e.target.value as "Akademik" | "Magang" })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans"
              >
                <option value="Akademik">Akademik (Riset / Tugas Akhir)</option>
                <option value="Magang">Magang (Proyek / Industri)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kategori Minat *
              </label>
              <select
                value={formData.kategori_id}
                onChange={(e) => setFormData({ ...formData, kategori_id: Number(e.target.value) })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans"
              >
                {kategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Deskripsi Detail Proyek & Ekspektasi Luaran *
            </label>
            <textarea
              rows={5}
              required
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Jelaskan gambaran umum proyek, tanggung jawab mahasiswa, serta luaran yang diharapkan..."
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Ketentuan & Lokasi */}
        <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-bold text-ink border-b border-steel/10 pb-3">
            2. Ketentuan & Lokasi Kerja
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kota Lokasi *
              </label>
              <select
                value={formData.lokasi_id}
                onChange={(e) => setFormData({ ...formData, lokasi_id: Number(e.target.value) })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans"
              >
                {kotaList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kota}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={formData.tingkat_kesulitan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tingkat_kesulitan: e.target.value as "Pemula" | "Menengah" | "Lanjut",
                  })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans"
              >
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjut">Lanjut</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kuota Slot Diterima *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.slot}
                onChange={(e) => setFormData({ ...formData, slot: Number(e.target.value) })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Batas Waktu Pendaftaran *
              </label>
              <input
                type="date"
                required
                value={formData.batas_waktu}
                onChange={(e) => setFormData({ ...formData, batas_waktu: e.target.value })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Gaji / Stipend (Opsional)
              </label>
              <input
                type="text"
                value={formData.gaji_stipend}
                onChange={(e) => setFormData({ ...formData, gaji_stipend: e.target.value })}
                placeholder="Contoh: Rp 2.000.000 / bulan"
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Target Prodi & Required Skills */}
        <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-6">
          <h2 className="font-display text-lg font-bold text-ink border-b border-steel/10 pb-3">
            3. Target Mahasiswa & Kualifikasi
          </h2>

          {/* Target Prodi */}
          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-2">
              Target Program Studi (Opsional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-2 border border-steel/15 rounded-xl bg-steel/5">
              {prodiList.map((prodi) => {
                const isSelected = formData.selectedProdiIds.includes(prodi.id);
                return (
                  <button
                    type="button"
                    key={prodi.id}
                    onClick={() => toggleProdi(prodi.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition font-mono ${
                      isSelected
                        ? "bg-ink text-paper font-medium"
                        : "bg-white text-ink hover:bg-steel/10 border border-steel/10"
                    }`}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded border flex items-center justify-center text-[10px] ${
                        isSelected ? "bg-bridge-gold border-bridge-gold text-ink" : "border-steel/40"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                    <span className="truncate">
                      {prodi.nama_prodi} ({prodi.jenjang})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-2">
              Keahlian / Skills yang Dibutuhkan (Opsional)
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 border border-steel/15 rounded-xl bg-steel/5">
              {skillList.map((skill) => {
                const isSelected = formData.selectedSkillIds.includes(skill.id);
                return (
                  <button
                    type="button"
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition border ${
                      isSelected
                        ? "bg-bridge-gold text-ink font-semibold border-bridge-gold"
                        : "bg-white text-steel hover:bg-steel/10 border-steel/20"
                    }`}
                  >
                    {skill.nama_skill} {isSelected ? "✓" : "+"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel/15">
          <Link
            href="/perusahaan/kolaborasi"
            className="rounded-full px-6 py-3 font-mono text-xs font-medium text-steel hover:bg-steel/10 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-bridge-gold px-8 py-3 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Ajukan Proyek Kolaborasi"}
          </button>
        </div>
      </form>
    </main>
  );
}