"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { companyService, companyServiceExtended } from "../../dashboard/services/companyServices";
import { pelamarService } from "../../pelamar/services/pelamarService";
import { PelamarProfilModal } from "../../pelamar/components/PelamarProfilModal";
import { StatusLamaran, PelamarDetail } from "../../pelamar/types/pelamar";

interface ProdiOption {
  id: number;
  nama_prodi: string;
  jenjang: string;
}

interface SkillOption {
  id: number;
  nama_skill: string;
}

// Rekomendasi Kategori Minat based on Title
function recommendKategori(judul: string, kategoriList: any[]): number[] {
  if (!judul) return [];
  const normalizedTitle = judul.toLowerCase();
  
  const mapping: { [key: string]: string[] } = {
    "Riset & Pengembangan": ["riset", "research", "pengembangan", "development", "ai", "machine learning", "deep learning", "science", "sains", "data", "analisis", "analyst", "survei", "survey", "academic", "akademik", "studi", "study"],
    "Teknologi & Produk Digital": ["web", "app", "mobile", "software", "developer", "coding", "program", "programmer", "database", "jaringan", "it", "cyber", "ai", "machine learning", "data scientist", "data analyst", "system", "sistem", "komputer", "frontend", "backend", "fullstack", "react", "python", "sql", "flutter", "aws", "cloud"],
    "Desain & Kreatif": ["desain", "design", "ui", "ux", "figma", "illustrator", "photoshop", "graphic", "visual", "art", "creative", "multimedia", "dkv", "video", "editing", "animasi", "content", "konten", "copywriter", "writer", "penulis", "creative direction"],
    "Bisnis & Pemasaran": ["marketing", "pemasaran", "seo", "sem", "social media", "content", "copywriting", "bisnis", "business", "manajemen", "management", "project", "product", "sales", "penjualan", "hr", "sumber daya", "startup", "growth"],
    "Keuangan & Akuntansi": ["finance", "keuangan", "akuntansi", "accounting", "pajak", "tax", "audit", "excel", "investasi", "bank", "perbankan", "fintech"],
    "Sains & Teknologi": ["sains", "science", "teknologi", "technology", "lab", "laboratorium", "fisika", "kimia", "biologi", "matematika", "statistika", "bio", "rekayasa"],
    "Sosial & Humaniora": ["sosial", "social", "humaniora", "psikologi", "hukum", "politik", "sejarah", "bahasa", "sastra", "komunikasi", "sosiologi", "antropologi"]
  };

  const scored: { id: number; score: number }[] = [];

  kategoriList.forEach(k => {
    const kName = k.nama_kategori;
    let score = 0;
    
    // Check word matches
    const words = kName.toLowerCase().split(/[\s&]+/);
    words.forEach((w: string) => {
      if (w.length > 2 && normalizedTitle.includes(w)) {
        score += 2.0;
      }
    });

    // Check keywords mappings
    const keywords = mapping[kName] || [];
    keywords.forEach(kw => {
      if (normalizedTitle.includes(kw)) {
        score += 1.0;
        const kwRegex = new RegExp(`\\b${kw}\\b`);
        if (kwRegex.test(normalizedTitle)) {
          score += 1.0;
        }
      }
    });

    if (score > 0) {
      scored.push({ id: k.id, score });
    }
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.id);
}

// Rekomendasi Program Studi & Skills based on Title & Kategori Minat
function recommendItems(
  judul: string,
  selectedKategoriIds: number[],
  kategoriList: any[],
  items: any[],
  nameField: string
): number[] {
  if (!judul && selectedKategoriIds.length === 0) return [];

  const normalizedTitle = judul.toLowerCase();
  
  const selectedKategoriNames = selectedKategoriIds
    .map(id => kategoriList.find(k => k.id === id)?.nama_kategori || "")
    .filter(Boolean)
    .map(name => name.toLowerCase());

  const searchString = `${normalizedTitle} ${selectedKategoriNames.join(" ")}`;

  const associations: { [key: string]: string[] } = {
    // Tech & IT
    "ai": ["python", "machine learning", "deep learning", "kecerdasan buatan", "data science", "tensorflow", "pytorch", "artificial intelligence", "informatika", "komputer", "sistem informasi"],
    "machine": ["python", "machine learning", "data science", "artificial intelligence", "informatika", "komputer"],
    "learning": ["python", "machine learning", "data science", "artificial intelligence", "informatika", "komputer"],
    "web": ["react", "javascript", "typescript", "html", "css", "frontend", "backend", "fullstack", "node", "next.js", "nextjs", "vue", "angular", "web", "website", "informatika", "sistem informasi"],
    "aplikasi": ["react", "javascript", "typescript", "frontend", "backend", "fullstack", "android", "ios", "flutter", "mobile", "informatika", "sistem informasi"],
    "mobile": ["react", "flutter", "react native", "swift", "kotlin", "android", "ios", "mobile", "informatika", "sistem informasi"],
    "software": ["react", "javascript", "typescript", "node", "python", "java", "c++", "git", "software", "development", "informatika", "sistem informasi"],
    "data": ["python", "sql", "pandas", "data analyst", "data scientist", "tableau", "power bi", "excel", "statistika", "informatika", "sistem informasi", "matematika"],
    "database": ["sql", "mysql", "postgresql", "mongodb", "database", "sistem informasi", "informatika"],
    "jaringan": ["jaringan", "networking", "cisco", "cybersecurity", "keamanan", "informatika", "sistem komputer"],
    
    // Design & Creative
    "desain": ["desain", "design", "ui", "ux", "figma", "illustrator", "photoshop", "graphic", "visual", "art", "creative", "multimedia", "dkv"],
    "design": ["desain", "design", "ui", "ux", "figma", "illustrator", "photoshop", "graphic", "visual", "art", "creative", "multimedia", "dkv"],
    "ui": ["desain", "design", "ui", "ux", "figma", "frontend", "visual", "dkv"],
    "ux": ["desain", "design", "ui", "ux", "figma", "visual", "sistem informasi"],
    "video": ["video", "editing", "premiere", "after effects", "creative", "multimedia", "dkv"],
    "konten": ["content", "konten", "creative", "writing", "copywriting", "marketing", "sosial media", "dkv", "ilmu komunikasi"],
    
    // Business, Finance, & Marketing
    "marketing": ["marketing", "pemasaran", "seo", "sem", "social media", "content", "copywriting", "digital marketing", "manajemen", "ilmu komunikasi"],
    "pemasaran": ["marketing", "pemasaran", "seo", "sem", "social media", "content", "copywriting", "digital marketing", "manajemen", "ilmu komunikasi"],
    "bisnis": ["business", "bisnis", "manajemen", "sistem informasi", "analisis bisnis", "akuntansi", "keuangan"],
    "business": ["business", "bisnis", "manajemen", "sistem informasi", "analisis bisnis", "akuntansi", "keuangan"],
    "keuangan": ["finance", "keuangan", "akuntansi", "accounting", "pajak", "excel", "manajemen"],
    "finance": ["finance", "keuangan", "akuntansi", "accounting", "pajak", "excel", "manajemen"],
    "akuntansi": ["akuntansi", "accounting", "audit", "pajak", "tax", "excel", "keuangan"],
    "accounting": ["akuntansi", "accounting", "audit", "pajak", "tax", "excel", "keuangan"],
    "audit": ["akuntansi", "accounting", "audit", "excel"],
    "manajemen": ["manajemen", "management", "project", "product", "hr", "sumber daya", "bisnis", "business"],
    "management": ["manajemen", "management", "project", "product", "hr", "sumber daya", "bisnis", "business"]
  };

  const targetTerms = new Set<string>();
  const words = searchString.split(/[\s,./()_-]+/).filter(w => w.length > 1);
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    targetTerms.add(lowerWord);
    if (associations[lowerWord]) {
      associations[lowerWord].forEach(term => targetTerms.add(term.toLowerCase()));
    }
  });

  const recommendations: { id: number; score: number }[] = [];

  items.forEach(item => {
    const name = item[nameField].toLowerCase();
    let score = 0;
    
    targetTerms.forEach(term => {
      if (name.includes(term)) {
        score += 1;
        const termRegex = new RegExp(`\\b${term}\\b`);
        if (termRegex.test(name)) {
          score += 1.5;
        }
      }
    });

    if (score > 0) {
      recommendations.push({ id: item.id, score });
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .map(r => r.id);
}

export default function DetailKolaborasiPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "pelamar" | "progress" | "settings") || "pelamar";

  // Tab State
  const [activeTab, setActiveTab] = useState<"pelamar" | "progress" | "settings">(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data State
  const [kolaborasi, setKolaborasi] = useState<any>(null);
  const [pelamarList, setPelamarList] = useState<PelamarDetail[]>([]);
  const [selectedPelamar, setSelectedPelamar] = useState<PelamarDetail | null>(null);

  const [statusVerifikasi, setStatusVerifikasi] = useState<string>("Menunggu Verifikasi");
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title: string; message: string; redirectOnClose?: boolean }>({
    isOpen: false,
    title: "",
    message: "",
    redirectOnClose: false,
  });

  const isVerified = statusVerifikasi === "Terverifikasi";

  // Master Options (for Settings form)
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [kotaList, setKotaList] = useState<any[]>([]);
  const [prodiList, setProdiList] = useState<ProdiOption[]>([]);
  const [skillList, setSkillList] = useState<SkillOption[]>([]);

  // Recommendation State
  const [recKategoriIds, setRecKategoriIds] = useState<number[]>([]);
  const [recProdiIds, setRecProdiIds] = useState<number[]>([]);
  const [recSkillIds, setRecSkillIds] = useState<number[]>([]);

  // Display limits for pagination (expand each 10)
  const [kategoriLimit, setKategoriLimit] = useState(10);
  const [prodiLimit, setProdiLimit] = useState(10);
  const [skillLimit, setSkillLimit] = useState(10);

  // Modal Pickers State
  const [isKotaModalOpen, setIsKotaModalOpen] = useState(false);
  const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isKategoriModalOpen, setIsKategoriModalOpen] = useState(false);

  // Search queries inside modals
  const [kotaSearch, setKotaSearch] = useState("");
  const [prodiSearch, setProdiSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [kategoriSearch, setKategoriSearch] = useState("");

  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Settings Form State
  const [formData, setFormData] = useState({
    judul: "",
    tipe: "Akademik" as "Akademik" | "Magang",
    selectedKategoriIds: [] as number[],
    lokasi_id: 1,
    tingkat_kesulitan: "Menengah" as "Pemula" | "Menengah" | "Lanjut",
    slot: 5,
    batas_waktu: "",
    gaji_stipend: "",
    deskripsi: "",
    selectedProdiIds: [] as number[],
    selectedSkillIds: [] as number[],
  });

  // Progress Tab States
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [evalCatatan, setEvalCatatan] = useState("");

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch options first
        const [categories, kotas, prodis, skills, profile] = await Promise.all([
          companyService.fetchKategoriMinat(),
          companyService.fetchKotaList(),
          companyServiceExtended.fetchProdiList(),
          companyServiceExtended.fetchSkillsList(),
          companyService.fetchCompanyProfile(),
        ]);

        if (isMounted) {
          setKategoriList(categories);
          setKotaList(kotas);
          setProdiList(prodis);
          setSkillList(skills);
          if (profile) {
            setStatusVerifikasi(profile.status_verifikasi);
          }
        }

        // Fetch collaboration detail
        const { data: row, error } = await supabase
          .from("kolaborasi")
          .select(`
            id, judul, tipe, deskripsi, lokasi_id, batas_waktu, status_moderasi,
            tingkat_kesulitan, gaji_stipend, slot, kategori_id,
            kategori_minat:kategori_id ( nama_kategori ),
            kota ( nama_kota ),
            kolaborasi_target_prodi ( prodi_id ),
            kolaborasi_skills ( skill_id ),
            pendaftaran_kolaborasi (
              id,
              kolaborasi_id,
              mahasiswa_id,
              tanggal_daftar,
              status,
              catatan_perusahaan,
              mahasiswa_profiles (
                nama_lengkap,
                semester,
                ringkasan_self,
                foto_url,
                reputation_score,
                universitas ( nama_universitas ),
                program_studi ( nama_prodi )
              )
            )
          `)
          .eq("id", id as string)
          .single();

        if (error) {
          console.error("Gagal memuat detail kolaborasi:", error.message);
          return;
        }

        if (row && isMounted) {
          // Fetch multiple categories with fallback
          let selectedKategoriIds: number[] = [];
          try {
            const { data: pivotData, error: pivotError } = await supabase
              .from("kolaborasi_kategori_minat")
              .select("kategori_id")
              .eq("kolaborasi_id", id as string);

            if (!pivotError && pivotData && pivotData.length > 0) {
              selectedKategoriIds = pivotData.map((d: any) => d.kategori_id);
            } else {
              if (row.kategori_id) {
                selectedKategoriIds = [row.kategori_id];
              }
            }
          } catch (err) {
            console.error("Gagal kueri kolaborasi_kategori_minat, fallback ke kategori_id:", err);
            if (row.kategori_id) {
              selectedKategoriIds = [row.kategori_id];
            }
          }

          setKolaborasi(row);

          // Map applicants
          const mappedPelamar: PelamarDetail[] = (row.pendaftaran_kolaborasi || []).map((p: any) => {
            const mProfile = p.mahasiswa_profiles;
            return {
              id: p.id,
              kolaborasi_id: p.kolaborasi_id,
              mahasiswa_id: p.mahasiswa_id,
              nama_lengkap: mProfile?.nama_lengkap || "Mahasiswa",
              universitas: mProfile?.universitas?.nama_universitas || "Universitas Tidak Diketahui",
              program_studi: mProfile?.program_studi?.nama_prodi || "Program Studi Tidak Diketahui",
              semester: mProfile?.semester || "-",
              ringkasan_self: mProfile?.ringkasan_self || "Tidak ada deskripsi profil.",
              foto_url: mProfile?.foto_url,
              reputation_score: mProfile?.reputation_score || 0,
              tanggal_daftar: p.tanggal_daftar,
              status: p.status,
              catatan_perusahaan: p.catatan_perusahaan,
            };
          });
          setPelamarList(mappedPelamar);

          // Populate Settings Form
          const activeProdis = (row.kolaborasi_target_prodi || []).map((p: any) => p.prodi_id);
          const activeSkills = (row.kolaborasi_skills || []).map((s: any) => s.skill_id);

          setFormData({
            judul: row.judul || "",
            tipe: row.tipe === "Magang" ? "Magang" : "Akademik",
            selectedKategoriIds: selectedKategoriIds,
            lokasi_id: row.lokasi_id || (kotas[0]?.id || 1),
            tingkat_kesulitan: row.tingkat_kesulitan || "Menengah",
            slot: row.slot || 5,
            batas_waktu: row.batas_waktu || "",
            gaji_stipend: row.gaji_stipend || "",
            deskripsi: row.deskripsi || "",
            selectedProdiIds: activeProdis,
            selectedSkillIds: activeSkills,
          });
        }
      } catch (err) {
        console.error("Gagal memuat detail kolaborasi:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Update Kategori Recommendations
  useEffect(() => {
    const recommendedKats = recommendKategori(formData.judul, kategoriList);
    setRecKategoriIds(recommendedKats);
  }, [formData.judul, kategoriList]);

  // Update Prodi & Skill Recommendations dynamically
  useEffect(() => {
    const recommendedProdis = recommendItems(
      formData.judul,
      formData.selectedKategoriIds,
      kategoriList,
      prodiList,
      "nama_prodi"
    );
    const recommendedSkills = recommendItems(
      formData.judul,
      formData.selectedKategoriIds,
      kategoriList,
      skillList,
      "nama_skill"
    );
    setRecProdiIds(recommendedProdis);
    setRecSkillIds(recommendedSkills);
  }, [formData.judul, formData.selectedKategoriIds, kategoriList, prodiList, skillList]);

  // Update applicant status
  const handleUpdateStatus = async (
    pendaftaranId: string,
    newStatus: StatusLamaran,
    catatan?: string
  ) => {
    const confirmMsg =
      newStatus === "Diterima"
        ? "Apakah Anda yakin ingin menerima pelamar ini?"
        : newStatus === "Ditolak"
        ? "Apakah Anda yakin ingin menolak pelamar ini?"
        : "Apakah Anda yakin ingin menandai proyek selesai untuk mahasiswa ini?";

    if (!confirm(confirmMsg)) return;

    const isSuccess = await pelamarService.updateStatusPelamar(pendaftaranId, newStatus, catatan);

    if (isSuccess) {
      setPelamarList((prev) =>
        prev.map((p) =>
          p.id === pendaftaranId
            ? { ...p, status: newStatus, catatan_perusahaan: catatan || p.catatan_perusahaan }
            : p
        )
      );
      if (selectedPelamar && selectedPelamar.id === pendaftaranId) {
        setSelectedPelamar((prev) =>
          prev ? { ...prev, status: newStatus, catatan_perusahaan: catatan || prev.catatan_perusahaan } : null
        );
      }
      setEvaluatingId(null);
      setEvalCatatan("");

      setSuccessModal({
        isOpen: true,
        title: "Status Diperbarui",
        message: `Status pelamar telah berhasil diubah menjadi: ${newStatus}.`,
      });
    } else {
      alert("Gagal memperbarui status pendaftaran.");
    }
  };

  // Submit Settings Edit
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (formData.selectedKategoriIds.length === 0) {
      alert("Pilih minimal satu Kategori Minat.");
      return;
    }

    setIsSaving(true);
    const success = await companyServiceExtended.updateFullKolaborasi(id as string, {
      judul: formData.judul,
      tipe: formData.tipe,
      kategori_id: formData.selectedKategoriIds[0] || 1, // primary fallback
      deskripsi: formData.deskripsi,
      lokasi_id: formData.lokasi_id,
      batas_waktu: formData.batas_waktu,
      tingkat_kesulitan: formData.tingkat_kesulitan,
      gaji_stipend: formData.gaji_stipend,
      slot: formData.slot,
      target_prodi_ids: formData.selectedProdiIds,
      skill_ids: formData.selectedSkillIds,
      target_kategori_ids: formData.selectedKategoriIds,
    });
    setIsSaving(false);

    if (success) {
      setSuccessModal({
        isOpen: true,
        title: "Perubahan Disimpan",
        message: "Detail kolaborasi telah berhasil diperbarui.",
      });
      // Get matched kategori names
      const matchedKategoriNames = formData.selectedKategoriIds
        .map(katId => kategoriList.find(k => k.id === katId)?.nama_kategori || "")
        .filter(Boolean)
        .join(", ");
      
      const matchedKota = kotaList.find((k) => k.id === formData.lokasi_id);
      
      setKolaborasi((prev: any) => ({
        ...prev,
        judul: formData.judul,
        tipe: formData.tipe,
        deskripsi: formData.deskripsi,
        batas_waktu: formData.batas_waktu,
        tingkat_kesulitan: formData.tingkat_kesulitan,
        gaji_stipend: formData.gaji_stipend,
        slot: formData.slot,
        kategori_minat: { nama_kategori: matchedKategoriNames || "Umum" },
        kota: matchedKota ? { nama_kota: matchedKota.nama_kota } : prev.kota,
      }));
    } else {
      alert("Gagal memperbarui kolaborasi. Periksa kembali input Anda.");
    }
  };

  // Delete collaboration
  const handleDeleteProyek = async () => {
    if (!id || !kolaborasi) return;

    const confirmFirst = confirm(`Apakah Anda yakin ingin menghapus kolaborasi "${kolaborasi.judul}"?`);
    if (!confirmFirst) return;

    setIsDeleting(true);
    const isSuccess = await companyService.deleteKolaborasi(id as string);
    setIsDeleting(false);

    if (isSuccess) {
      setSuccessModal({
        isOpen: true,
        title: "Proyek Dihapus",
        message: "Proyek kolaborasi berhasil dihapus dari database.",
        redirectOnClose: true,
      });
    } else {
      alert("Gagal menghapus proyek. Periksa kembali hak akses Anda.");
    }
  };

  // Target Prodi Toggles
  const toggleProdi = (prodiId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedProdiIds.includes(prodiId);
      return {
        ...prev,
        selectedProdiIds: exists
          ? prev.selectedProdiIds.filter((pId) => pId !== prodiId)
          : [...prev.selectedProdiIds, prodiId],
      };
    });
  };

  // Required Skills Toggles
  const toggleSkill = (skillId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedSkillIds.includes(skillId);
      return {
        ...prev,
        selectedSkillIds: exists
          ? prev.selectedSkillIds.filter((sId) => sId !== skillId)
          : [...prev.selectedSkillIds, skillId],
      };
    });
  };

  // Checkbox Kategori Minat Toggle
  const toggleKategori = (katId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedKategoriIds.includes(katId);
      return {
        ...prev,
        selectedKategoriIds: exists
          ? prev.selectedKategoriIds.filter((kId) => kId !== katId)
          : [...prev.selectedKategoriIds, katId],
      };
    });
  };

  // Custom DB Insertion Handlers
  const handleAddCustomKategori = async (namaKategori: string) => {
    if (!namaKategori.trim()) return;
    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from("kategori_minat")
        .insert([{ nama_kategori: namaKategori }])
        .select("id, nama_kategori")
        .single();

      if (!error && data) {
        setKategoriList(prev => [...prev, data]);
        toggleKategori(data.id);
        setKategoriSearch("");
      } else {
        const { data: existing } = await supabase
          .from("kategori_minat")
          .select("id, nama_kategori")
          .eq("nama_kategori", namaKategori)
          .maybeSingle();

        if (existing) {
          if (!kategoriList.some(k => k.id === existing.id)) {
            setKategoriList(prev => [...prev, existing]);
          }
          toggleKategori(existing.id);
          setKategoriSearch("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  const handleAddCustomProdi = async (namaProdi: string) => {
    if (!namaProdi.trim()) return;
    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from("program_studi")
        .insert([{ nama_prodi: namaProdi, jenjang: "Umum" }])
        .select("id, nama_prodi, jenjang")
        .single();

      if (!error && data) {
        setProdiList(prev => [...prev, data]);
        toggleProdi(data.id);
        setProdiSearch("");
      } else {
        const { data: existing } = await supabase
          .from("program_studi")
          .select("id, nama_prodi, jenjang")
          .eq("nama_prodi", namaProdi)
          .maybeSingle();

        if (existing) {
          if (!prodiList.some(p => p.id === existing.id)) {
            setProdiList(prev => [...prev, existing]);
          }
          toggleProdi(existing.id);
          setProdiSearch("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  const handleAddCustomSkill = async (namaSkill: string) => {
    if (!namaSkill.trim()) return;
    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .insert([{ nama_skill: namaSkill }])
        .select("id, nama_skill")
        .single();

      if (!error && data) {
        setSkillList(prev => [...prev, data]);
        toggleSkill(data.id);
        setSkillSearch("");
      } else {
        const { data: existing } = await supabase
          .from("skills")
          .select("id, nama_skill")
          .eq("nama_skill", namaSkill)
          .maybeSingle();

        if (existing) {
          if (!skillList.some(s => s.id === existing.id)) {
            setSkillList(prev => [...prev, existing]);
          }
          toggleSkill(existing.id);
          setSkillSearch("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  // Prepend "Lainnya" option to prodiList for Universitas & Program Studi selections rule
  const cleanProdiList = prodiList.filter(p => p && p.nama_prodi);
  const prodisWithLainnya = cleanProdiList.some(p => p.nama_prodi === "Lainnya")
    ? cleanProdiList
    : [{ id: -999, nama_prodi: "Lainnya", jenjang: "Umum" }, ...cleanProdiList];

  // 1. Sort Kategori Minat
  const top10RecProdiIds = useMemo(() => recProdiIds.slice(0, 10), [recProdiIds]);
  const top10RecSkillIds = useMemo(() => recSkillIds.slice(0, 10), [recSkillIds]);

  const sortedKategoris = useMemo(() => {
    return [...kategoriList].sort((a, b) => {
      const aSel = formData.selectedKategoriIds.includes(a.id);
      const bSel = formData.selectedKategoriIds.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aRecIdx = recKategoriIds.indexOf(a.id);
      const bRecIdx = recKategoriIds.indexOf(b.id);
      const aRec = aRecIdx !== -1;
      const bRec = bRecIdx !== -1;
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      if (aRec && bRec) return aRecIdx - bRecIdx;

      return 0;
    });
  }, [kategoriList, formData.selectedKategoriIds, recKategoriIds]);

  // 2. Sort Prodi List
  const sortedProdis = useMemo(() => {
    return [...prodisWithLainnya].sort((a, b) => {
      const aSel = formData.selectedProdiIds.includes(a.id);
      const bSel = formData.selectedProdiIds.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aRecIdx = recProdiIds.indexOf(a.id);
      const bRecIdx = recProdiIds.indexOf(b.id);
      const aRec = aRecIdx !== -1;
      const bRec = bRecIdx !== -1;
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      if (aRec && bRec) return aRecIdx - bRecIdx;

      return 0;
    });
  }, [prodisWithLainnya, formData.selectedProdiIds, recProdiIds]);

  // 3. Sort Skill List
  const sortedSkills = useMemo(() => {
    return [...skillList].sort((a, b) => {
      const aSel = formData.selectedSkillIds.includes(a.id);
      const bSel = formData.selectedSkillIds.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;

      const aRecIdx = recSkillIds.indexOf(a.id);
      const bRecIdx = recSkillIds.indexOf(b.id);
      const aRec = aRecIdx !== -1;
      const bRec = bRecIdx !== -1;
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      if (aRec && bRec) return aRecIdx - bRecIdx;

      return 0;
    });
  }, [skillList, formData.selectedSkillIds, recSkillIds]);

  // Paginated/limited lists based on current limit states
  const visibleKategoris = sortedKategoris.slice(0, kategoriLimit);
  const visibleProdis = sortedProdis.slice(0, prodiLimit);
  const visibleSkills = sortedSkills.slice(0, skillLimit);

  // Search calculations for Modals
  const searchedKotaOptions = kotaList.filter(k => 
    k.nama_kota.toLowerCase().includes(kotaSearch.toLowerCase())
  );
  const searchedKategoriOptions = kategoriList.filter(k => 
    k.nama_kategori.toLowerCase().includes(kategoriSearch.toLowerCase())
  );
  const isKategoriSearchEmpty = searchedKategoriOptions.length === 0 && kategoriSearch.trim() !== "";

  const searchedProdiOptions = prodisWithLainnya.filter(p => 
    p.nama_prodi.toLowerCase().includes(prodiSearch.toLowerCase())
  );
  const isProdiSearchEmpty = searchedProdiOptions.length === 0 && prodiSearch.trim() !== "";

  const searchedSkillOptions = skillList.filter(s => 
    s.nama_skill.toLowerCase().includes(skillSearch.toLowerCase())
  );
  const isSkillSearchEmpty = searchedSkillOptions.length === 0 && skillSearch.trim() !== "";

  // Selected city object
  const selectedKotaObj = kotaList.find(k => k.id === formData.lokasi_id);

  // Stats derivation
  const stats = {
    total: pelamarList.length,
    menunggu: pelamarList.filter((p) => p.status === "Menunggu").length,
    diterima: pelamarList.filter((p) => p.status === "Diterima").length,
    ditolak: pelamarList.filter((p) => p.status === "Ditolak").length,
    selesai: pelamarList.filter((p) => p.status === "Selesai").length,
  };

  const activeTeamCount = stats.diterima + stats.selesai;
  let progressState = "Seleksi Pelamar";
  let progressDesc = "Sedang mengevaluasi profil pendaftar mahasiswa.";
  if (stats.selesai > 0 && stats.diterima === 0) {
    progressState = "Selesai";
    progressDesc = "Seluruh rangkaian kolaborasi selesai dijalankan.";
  } else if (activeTeamCount > 0) {
    progressState = "Kolaborasi Berjalan";
    progressDesc = "Sedang berkolaborasi aktif dengan tim mahasiswa terpilih.";
  }

  const getKategoriDisplay = () => {
    return kolaborasi.kategori_minat?.nama_kategori || "Umum";
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
        Memuat detail proyek kolaborasi...
      </div>
    );
  }

  if (statusVerifikasi !== "Terverifikasi") {
    return (
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-16 text-center font-sans">
        <div className="rounded-2xl border border-dashed border-red-300 bg-red-50/50 p-8 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-red-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h2 className="mt-4 font-display text-lg font-bold text-ink">
            Akses Terkunci
          </h2>
          <p className="mt-2 font-mono text-xs text-steel max-w-md mx-auto leading-relaxed">
            Akun perusahaan Anda belum diverifikasi oleh administrator. Untuk mengelola kolaborasi, melihat pelamar, atau mengubah pengaturan, akun Anda harus berada dalam status <span className="text-emerald-700 font-bold">Terverifikasi</span> (Status saat ini: <strong className="text-red-700">{statusVerifikasi}</strong>). Harap tunggu proses verifikasi oleh administrator.
          </p>
          <div className="mt-6">
            <Link
              href="/perusahaan/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition shadow-sm"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!kolaborasi) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Proyek tidak ditemukan</h2>
        <p className="mt-2 text-xs text-steel">Proyek mungkin sudah dihapus atau tautan tidak valid.</p>
        <Link
          href="/perusahaan/kolaborasi"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 font-mono text-xs font-bold text-paper hover:bg-steel transition"
        >
          Kembali ke Daftar Kolaborasi
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
      {/* Breadcrumb & Header */}
      <div className="border-b border-steel/15 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-steel">
          <Link href="/perusahaan/kolaborasi" className="hover:text-ink transition">
            Kelola Kolaborasi
          </Link>
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-ink font-medium truncate max-w-[200px] sm:max-w-xs">{kolaborasi.judul}</span>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-steel/10 px-3 py-1 font-mono text-[11px] font-medium text-steel">
                {getKategoriDisplay()}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold border ${
                  kolaborasi.tipe === "Magang"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                }`}
              >
                {kolaborasi.tipe}
              </span>
              <span className="rounded-full bg-bridge-gold/15 border border-bridge-gold/30 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
                Slot: {kolaborasi.slot || 0}
              </span>
              <span className="rounded-full bg-steel/5 border border-steel/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-steel">
                Moderasi: {kolaborasi.status_moderasi}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
              {kolaborasi.judul}
            </h1>
          </div>

          <Link
            href="/perusahaan/kolaborasi"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-steel/20 bg-white px-4 py-2 font-mono text-xs font-medium text-ink hover:bg-steel/5 transition shadow-sm self-start md:self-auto"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali ke Daftar
          </Link>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="mt-6 flex border-b border-steel/10 font-mono text-xs">
        <button
          onClick={() => setActiveTab("pelamar")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 transition font-medium ${
            activeTab === "pelamar"
              ? "border-bridge-gold text-ink font-semibold"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          Daftar Pelamar ({stats.menunggu})
        </button>

        <button
          onClick={() => setActiveTab("progress")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 transition font-medium ${
            activeTab === "progress"
              ? "border-bridge-gold text-ink font-semibold"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Progres & Hasil ({activeTeamCount})
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 transition font-medium ${
            activeTab === "settings"
              ? "border-bridge-gold text-ink font-semibold"
              : "border-transparent text-steel hover:text-ink"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-8 font-sans">
        {/* ==================== TAB 1: DAFTAR PELAMAR ==================== */}
        {activeTab === "pelamar" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-steel/15 bg-white p-4">
                <span className="font-mono text-[10px] text-steel block">Total Pelamar</span>
                <strong className="font-display text-xl font-bold text-ink">{stats.total}</strong>
              </div>
              <div className="rounded-2xl border border-steel/15 bg-white p-4">
                <span className="font-mono text-[10px] text-steel block">Menunggu Review</span>
                <strong className="font-display text-xl font-bold text-amber-600">{stats.menunggu}</strong>
              </div>
              <div className="rounded-2xl border border-steel/15 bg-white p-4">
                <span className="font-mono text-[10px] text-steel block">Diterima</span>
                <strong className="font-display text-xl font-bold text-emerald-700">{stats.diterima}</strong>
              </div>
              <div className="rounded-2xl border border-steel/15 bg-white p-4">
                <span className="font-mono text-[10px] text-steel block">Ditolak</span>
                <strong className="font-display text-xl font-bold text-red-700">{stats.ditolak}</strong>
              </div>
            </div>

            <div className="space-y-3">
              {pelamarList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-steel/20 bg-white p-12 text-center font-mono text-xs text-steel">
                  Belum ada mahasiswa yang melamar pada proyek kolaborasi ini.
                </div>
              ) : (
                pelamarList.map((pelamar) => (
                  <div
                    key={pelamar.id}
                    className="rounded-2xl border border-steel/15 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-steel/30 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bridge-gold/20 font-display font-bold text-ink text-base">
                        {pelamar.nama_lengkap.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display font-bold text-ink text-sm sm:text-base">
                            {pelamar.nama_lengkap}
                          </h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold border ${
                              pelamar.status === "Diterima"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : pelamar.status === "Ditolak"
                                ? "bg-red-50 text-red-800 border-red-200"
                                : pelamar.status === "Selesai"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {pelamar.status}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-steel mt-0.5">
                          {pelamar.program_studi} (Smtr {pelamar.semester}) • {pelamar.universitas}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px] text-steel">
                          <span className="inline-flex items-center gap-1">
                            Reputasi: <strong className="text-bridge-gold font-bold">{pelamar.reputation_score} Pts</strong>
                          </span>
                          <span>•</span>
                          <span>Daftar: {new Date(pelamar.tanggal_daftar).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
                      <button
                        onClick={() => setSelectedPelamar(pelamar)}
                        className="rounded-full bg-steel/10 px-4 py-2 font-mono text-xs font-medium text-ink hover:bg-steel/20 transition"
                      >
                        Detail Profil
                      </button>
                      {pelamar.status === "Menunggu" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(pelamar.id, "Diterima")}
                            className="rounded-full bg-emerald-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-emerald-700 transition"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(pelamar.id, "Ditolak")}
                            className="rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-50 transition border border-red-200"
                            title="Tolak Pelamar"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PROGRES & HASIL ==================== */}
        {activeTab === "progress" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-steel/15 bg-white p-6 space-y-4">
                <h3 className="font-display font-bold text-ink text-base">Status Progres Kolaborasi</h3>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                      progressState === "Selesai"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : progressState === "Kolaborasi Berjalan"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {progressState}
                  </span>
                  <p className="mt-3 text-xs text-steel font-medium leading-relaxed">
                    {progressDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-steel/10 grid grid-cols-2 gap-4 text-center font-mono">
                  <div className="bg-steel/5 rounded-xl p-3">
                    <span className="text-[10px] text-steel block">Tim Aktif</span>
                    <strong className="text-lg text-ink font-bold">{activeTeamCount}</strong>
                  </div>
                  <div className="bg-steel/5 rounded-xl p-3">
                    <span className="text-[10px] text-steel block">Lulus/Selesai</span>
                    <strong className="text-lg text-emerald-700 font-bold">{stats.selesai}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-steel/15 bg-white p-6 space-y-5">
                <h3 className="font-display font-bold text-ink text-base">Milestone Pelaksanaan</h3>
                <div className="relative border-l border-steel/15 pl-4 space-y-6 font-mono text-xs">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-emerald-600 border border-white" />
                    <strong className="text-ink text-[11px] block">1. Persiapan & Publikasi</strong>
                    <p className="text-[10px] text-steel mt-0.5 font-sans leading-relaxed">Peluang kolaborasi dipublikasikan di platform.</p>
                  </div>
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border border-white ${
                      stats.total > 0 ? "bg-emerald-600" : "bg-amber-500"
                    }`} />
                    <strong className="text-ink text-[11px] block">2. Seleksi Mahasiswa</strong>
                    <p className="text-[10px] text-steel mt-0.5 font-sans leading-relaxed">Mengevaluasi lamaran pendaftaran mahasiswa.</p>
                  </div>
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border border-white ${
                      activeTeamCount > 0 ? "bg-emerald-600" : "bg-steel/30"
                    }`} />
                    <strong className="text-ink text-[11px] block">3. Kolaborasi Aktif</strong>
                    <p className="text-[10px] text-steel mt-0.5 font-sans leading-relaxed">Melaksanakan pengerjaan proyek bersama tim terpilih.</p>
                  </div>
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border border-white ${
                      stats.selesai > 0 && stats.diterima === 0 ? "bg-emerald-600" : "bg-steel/30"
                    }`} />
                    <strong className="text-ink text-[11px] block">4. Evaluasi & Selesai</strong>
                    <p className="text-[10px] text-steel mt-0.5 font-sans leading-relaxed">Pemberian review akhir serta sertifikat kelulusan.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-steel/15 bg-white p-6 space-y-4">
                <h3 className="font-display font-bold text-ink text-base">Daftar Tim Mahasiswa</h3>
                <div className="space-y-4">
                  {pelamarList.filter((p) => p.status === "Diterima" || p.status === "Selesai").length === 0 ? (
                    <div className="py-8 text-center font-mono text-xs text-steel">
                      Belum ada mahasiswa yang berstatus diterima/aktif.
                    </div>
                  ) : (
                    pelamarList
                      .filter((p) => p.status === "Diterima" || p.status === "Selesai")
                      .map((member) => (
                        <div
                          key={member.id}
                          className="rounded-xl border border-steel/10 bg-steel/5 p-4 space-y-3 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bridge-gold/30 font-display font-bold text-ink text-sm">
                                {member.nama_lengkap.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-display font-bold text-ink text-sm">{member.nama_lengkap}</h4>
                                <p className="font-mono text-[10px] text-steel">
                                  {member.program_studi} • {member.universitas}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold border ${
                                  member.status === "Selesai"
                                    ? "bg-blue-50 text-blue-800 border-blue-200"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                }`}
                              >
                                {member.status === "Selesai" ? "Selesai" : "Bekerja"}
                              </span>
                              {member.status === "Diterima" && evaluatingId !== member.id && (
                                <button
                                  onClick={() => {
                                    setEvaluatingId(member.id);
                                    setEvalCatatan("");
                                  }}
                                  className="rounded-full bg-bridge-gold px-3.5 py-1.5 font-mono text-[10px] font-bold text-ink hover:bg-bridge-gold/90 transition shadow-xs"
                                >
                                  Tandai Selesai
                                </button>
                              )}
                            </div>
                          </div>

                          {evaluatingId === member.id && (
                            <div className="mt-3 border-t border-steel/10 pt-3 space-y-3">
                              <div>
                                <label className="block font-mono text-[10px] font-semibold text-steel uppercase mb-1">
                                  Catatan Evaluasi / Rekomendasi Perusahaan
                                </label>
                                <textarea
                                  rows={3}
                                  value={evalCatatan}
                                  onChange={(e) => setEvalCatatan(e.target.value)}
                                  placeholder="Berikan feedback atau ulasan penyelesaian tugas mahasiswa pada proyek ini..."
                                  className="w-full rounded-xl border border-steel/15 px-3 py-2 text-xs outline-none focus:border-bridge-gold bg-white"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEvaluatingId(null)}
                                  className="rounded-full border border-steel/20 bg-white px-3 py-1 font-mono text-[10px] text-steel"
                                >
                                  Batal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(member.id, "Selesai", evalCatatan)}
                                  className="rounded-full bg-emerald-600 px-4 py-1 font-mono text-[10px] font-bold text-white hover:bg-emerald-700"
                                >
                                  Simpan Selesai
                                </button>
                              </div>
                            </div>
                          )}

                          {member.status === "Selesai" && member.catatan_perusahaan && (
                            <div className="mt-2 text-xs border-t border-steel/10 pt-2 font-mono">
                              <span className="text-steel font-semibold text-[10px] block">Catatan Evaluasi:</span>
                              <p className="font-sans text-[11px] text-ink italic mt-1 bg-white/70 rounded-lg p-2.5 border border-steel/5">
                                "{member.catatan_perusahaan}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>

              {activeTeamCount > 0 && (
                <div className="rounded-2xl border border-steel/15 bg-white p-6 space-y-4">
                  <h3 className="font-display font-bold text-ink text-base">Laporan & Pengumpulan Tugas</h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-3 border border-steel/10 rounded-xl bg-steel/5">
                      <div className="space-y-1">
                        <span className="font-bold text-ink">Dokumen Proposal Awal Proyek</span>
                        <p className="text-[10px] text-steel font-sans">Dikirim oleh Tim Mahasiswa</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
                        Disetujui
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-steel/10 rounded-xl bg-steel/5">
                      <div className="space-y-1">
                        <span className="font-bold text-ink">Laporan Kemajuan Progres</span>
                        <p className="text-[10px] text-steel font-sans">Dikirim oleh Tim Mahasiswa</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
                        Disetujui
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-steel/10 rounded-xl bg-steel/5">
                      <div className="space-y-1">
                        <span className="font-bold text-ink">Laporan Hasil Akhir & Dokumentasi Luaran</span>
                        <p className="text-[10px] text-steel font-sans">Menunggu unggahan berkas oleh tim</p>
                      </div>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-semibold text-amber-800">
                        Dalam Proses
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SETTINGS ==================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Section 1: Detail Proyek */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-ink border-b border-steel/10 pb-3">
                  Informasi Proyek Kolaborasi
                </h3>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Judul Proyek / Lowongan Magang *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
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
                      Kota Lokasi *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsKotaModalOpen(true)}
                      className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold font-sans text-left flex items-center justify-between hover:bg-steel/5 transition"
                    >
                      <span className="truncate">{selectedKotaObj?.nama_kota || "Pilih Kota Lokasi"}</span>
                      <svg className="h-4 w-4 text-steel/50 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Kategori Minat (Top 10 / Pagination) */}
                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-2">
                    Kategori Minat (Pilih minimal satu) *
                  </label>
                  <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 space-y-3 font-mono text-xs">
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                      {visibleKategoris.map((kat) => {
                        const isSelected = formData.selectedKategoriIds.includes(kat.id);
                        const isRec = recKategoriIds.includes(kat.id);
                        return (
                          <button
                            type="button"
                            key={kat.id}
                            onClick={() => toggleKategori(kat.id)}
                            className={`px-3.5 py-1.5 rounded-full transition border ${
                              isSelected
                                ? "bg-ink text-paper font-semibold border-ink"
                                : isRec
                                ? "bg-emerald-50/30 text-emerald-800 border-emerald-500/20 hover:bg-emerald-50/50"
                                : "bg-white text-steel hover:bg-steel/10 border-steel/20"
                            }`}
                          >
                            {kat.nama_kategori} {isSelected ? "✓" : isRec ? "+" : "+"}
                          </button>
                        );
                      })}
                    </div>

                    {sortedKategoris.length > kategoriLimit && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setKategoriLimit(prev => prev + 10)}
                          className="font-mono text-[10px] text-steel hover:text-ink font-bold transition"
                        >
                          Tampilkan lebih banyak (+10)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIsKategoriModalOpen(true)}
                      className="font-mono text-[10px] text-bridge-gold font-bold hover:underline"
                    >
                      Tidak ada di list? Cari Kategori Minat
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-medium text-ink mb-1">
                    Deskripsi Detail Proyek & Ekspektasi Luaran *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans leading-relaxed bg-white"
                  />
                </div>
              </div>

              {/* Section 2: Ketentuan */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-ink border-b border-steel/10 pb-3">
                  Ketentuan Proyek
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-medium text-ink mb-1">
                      Batas Waktu Pendaftaran *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.batas_waktu}
                      onChange={(e) => setFormData({ ...formData, batas_waktu: e.target.value })}
                      className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
                    />
                  </div>
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
                    className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold font-sans bg-white"
                  />
                </div>
              </div>

              {/* Section 3: Target Prodi & Skills */}
              <div className="rounded-2xl border border-steel/15 bg-white p-6 shadow-sm space-y-6">
                <h3 className="font-display text-base font-bold text-ink border-b border-steel/10 pb-3">
                  Kualifikasi Mahasiswa
                </h3>

                {/* Target Prodi */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-xs font-medium text-ink">
                      Target Program Studi (Top 10 Relevan)
                    </label>
                    {top10RecProdiIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            selectedProdiIds: Array.from(new Set([...prev.selectedProdiIds, ...top10RecProdiIds]))
                          }));
                        }}
                        className="font-mono text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition"
                      >
                        + Pilih Semua Rekomendasi ({top10RecProdiIds.length})
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 border border-steel/15 rounded-xl bg-steel/5 space-y-3 font-mono text-xs animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {visibleProdis.length === 0 ? (
                        <div className="col-span-full py-4 text-center font-mono text-[11px] text-steel">
                          Tidak ada rekomendasi program studi otomatis untuk judul ini.
                        </div>
                      ) : (
                        visibleProdis.map((prodi) => {
                          const isSelected = formData.selectedProdiIds.includes(prodi.id);
                          const isRec = top10RecProdiIds.includes(prodi.id);
                          return (
                            <button
                              type="button"
                              key={prodi.id}
                              onClick={() => toggleProdi(prodi.id)}
                              className={`flex items-center justify-between p-2 rounded-lg text-xs text-left transition font-mono ${
                                isSelected
                                  ? "bg-ink text-paper font-medium"
                                  : isRec
                                  ? "bg-emerald-50/20 text-ink border border-emerald-500/20 hover:bg-emerald-50/40"
                                  : "bg-white text-ink hover:bg-steel/10 border border-steel/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className={`h-3.5 w-3.5 rounded border flex items-center justify-center text-[10px] ${
                                    isSelected ? "bg-bridge-gold border-bridge-gold text-ink" : "border-steel/40 bg-white"
                                  }`}
                                >
                                  {isSelected ? "✓" : ""}
                                </span>
                                <span className="truncate text-[11px]">
                                  {prodi.nama_prodi} {prodi.jenjang !== "Umum" ? `(${prodi.jenjang})` : ""}
                                </span>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>

                    {sortedProdis.length > prodiLimit && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setProdiLimit(prev => prev + 10)}
                          className="font-mono text-[10px] text-steel hover:text-ink font-bold transition"
                        >
                          Tampilkan lebih banyak (+10)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIsProdiModalOpen(true)}
                      className="font-mono text-[10px] text-bridge-gold font-bold hover:underline"
                    >
                      Tidak ada di list? Cari Program Studi
                    </button>
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-xs font-medium text-ink">
                      Keahlian / Skills yang Dibutuhkan (Top 10 Relevan)
                    </label>
                    {top10RecSkillIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            selectedSkillIds: Array.from(new Set([...prev.selectedSkillIds, ...top10RecSkillIds]))
                          }));
                        }}
                        className="font-mono text-[10px] font-bold text-emerald-700 hover:text-emerald-800 transition"
                      >
                        + Pilih Semua Rekomendasi ({top10RecSkillIds.length})
                      </button>
                    )}
                  </div>

                  <div className="p-3 border border-steel/15 rounded-xl bg-steel/5 space-y-3 font-mono text-xs">
                    <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                      {visibleSkills.length === 0 ? (
                        <div className="w-full py-4 text-center font-mono text-[11px] text-steel">
                          Tidak ada rekomendasi keahlian otomatis untuk judul ini.
                        </div>
                      ) : (
                        visibleSkills.map((skill) => {
                          const isSelected = formData.selectedSkillIds.includes(skill.id);
                          const isRec = top10RecSkillIds.includes(skill.id);
                          return (
                            <button
                              type="button"
                              key={skill.id}
                              onClick={() => toggleSkill(skill.id)}
                              className={`px-3 py-1.5 rounded-full transition border ${
                                isSelected
                                  ? "bg-bridge-gold text-ink font-semibold border-bridge-gold"
                                  : isRec
                                  ? "bg-emerald-50/20 text-emerald-800 border-emerald-500/20 hover:bg-emerald-50/40"
                                  : "bg-white text-steel hover:bg-steel/10 border-steel/20"
                              }`}
                            >
                              {skill.nama_skill} {isSelected ? "✓" : isRec ? "+" : "+"}
                            </button>
                          );
                        })
                      )}
                    </div>

                    {sortedSkills.length > skillLimit && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setSkillLimit(prev => prev + 10)}
                          className="font-mono text-[10px] text-steel hover:text-ink font-bold transition"
                        >
                          Tampilkan lebih banyak (+10)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIsSkillModalOpen(true)}
                      className="font-mono text-[10px] text-bridge-gold font-bold hover:underline"
                    >
                      Tidak ada di list? Cari Keahlian / Skill
                    </button>
                  </div>
                </div>
                        {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3">
                {!isVerified ? (
                  <button
                    type="button"
                    disabled
                    title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                    className="rounded-full bg-steel/20 px-8 py-3 font-mono text-xs font-bold text-steel/40 cursor-not-allowed border border-dashed border-steel/30 flex items-center gap-1.5"
                  >
                    <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Simpan Perubahan (Menunggu Verifikasi)
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-bridge-gold px-8 py-3 font-mono text-xs font-bold text-ink hover:bg-bridge-gold/90 transition shadow-md disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                )}
              </div>
            </div>
          </form>
 
            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 space-y-4">
              <div>
                <h4 className="font-display text-base font-bold text-red-800">Zona Bahaya</h4>
                <p className="text-xs text-red-600 font-medium mt-1 font-sans">
                  Tindakan ini tidak dapat dibatalkan. Menghapus kolaborasi akan menghapus permanen data proyek dan seluruh pendaftaran mahasiswa yang masuk.
                </p>
              </div>
              {!isVerified ? (
                <button
                  type="button"
                  disabled
                  title="Fitur terkunci. Harap tunggu verifikasi akun perusahaan oleh administrator."
                  className="rounded-full bg-steel/15 px-6 py-2.5 font-mono text-xs font-bold text-steel/40 cursor-not-allowed border border-dashed border-steel/25 flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Hapus Kolaborasi (Menunggu Verifikasi)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteProyek}
                  disabled={isDeleting}
                  className="rounded-full bg-red-600 px-6 py-2.5 font-mono text-xs font-bold text-white hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                >
                  {isDeleting ? "Menghapus..." : "Hapus Kolaborasi"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Profil Pelamar */}
      {selectedPelamar && (
        <PelamarProfilModal
          pelamar={selectedPelamar}
          onClose={() => setSelectedPelamar(null)}
          onUpdateStatus={(pendaftaranId, newStatus) => handleUpdateStatus(pendaftaranId, newStatus)}
        />
      )}

      {/* ==================== MODAL PICKER: KOTA LOKASI ==================== */}
      {isKotaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Kota Lokasi</h3>
              <button
                onClick={() => {
                  setIsKotaModalOpen(false);
                  setKotaSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={kotaSearch}
                onChange={(e) => setKotaSearch(e.target.value)}
                placeholder="Ketik nama kota..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {searchedKotaOptions.length === 0 ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Kota tidak ditemukan.
                </div>
              ) : (
                searchedKotaOptions.map((k) => {
                  const isSelected = formData.lokasi_id === k.id;
                  return (
                    <button
                      type="button"
                      key={k.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, lokasi_id: k.id }));
                        setIsKotaModalOpen(false);
                        setKotaSearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-ink text-paper font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>{k.nama_kota}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PICKER: KATEGORI MINAT ==================== */}
      {isKategoriModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Kategori Minat</h3>
              <button
                onClick={() => {
                  setIsKategoriModalOpen(false);
                  setKategoriSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={kategoriSearch}
                onChange={(e) => setKategoriSearch(e.target.value)}
                placeholder="Cari atau tambahkan kategori..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {isKategoriSearchEmpty && (
                <button
                  type="button"
                  disabled={isCreatingCustom}
                  onClick={() => handleAddCustomKategori(kategoriSearch)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/20 text-emerald-800 font-bold hover:bg-emerald-50/40 transition block text-[11px]"
                >
                  {isCreatingCustom ? "Menambahkan..." : `+ Tambahkan "${kategoriSearch}" sebagai kustom`}
                </button>
              )}

              {searchedKategoriOptions.length === 0 && !isKategoriSearchEmpty ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Tidak ada kategori minat yang cocok.
                </div>
              ) : (
                searchedKategoriOptions.map((k) => {
                  const isSelected = formData.selectedKategoriIds.includes(k.id);
                  return (
                    <button
                      type="button"
                      key={k.id}
                      onClick={() => toggleKategori(k.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-ink text-paper font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>{k.nama_kategori}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-steel/10 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsKategoriModalOpen(false);
                  setKategoriSearch("");
                }}
                className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PICKER: PROGRAM STUDI ==================== */}
      {isProdiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Program Studi</h3>
              <button
                onClick={() => {
                  setIsProdiModalOpen(false);
                  setProdiSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={prodiSearch}
                onChange={(e) => setProdiSearch(e.target.value)}
                placeholder="Cari atau tambahkan program studi..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {isProdiSearchEmpty && (
                <button
                  type="button"
                  disabled={isCreatingCustom}
                  onClick={() => handleAddCustomProdi(prodiSearch)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/20 text-emerald-800 font-bold hover:bg-emerald-50/40 transition block text-[11px]"
                >
                  {isCreatingCustom ? "Menambahkan..." : `+ Tambahkan "${prodiSearch}" sebagai kustom`}
                </button>
              )}

              {searchedProdiOptions.length === 0 && !isProdiSearchEmpty ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Tidak ada program studi yang cocok.
                </div>
              ) : (
                searchedProdiOptions.map((p) => {
                  const isSelected = formData.selectedProdiIds.includes(p.id);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        if (p.id === -999) {
                          alert("Pilih program studi spesifik atau buat baru dengan mengetik di kolom pencarian.");
                          return;
                        }
                        toggleProdi(p.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-ink text-paper font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>
                        {p.nama_prodi} {p.jenjang && p.jenjang !== "Umum" ? `(${p.jenjang})` : ""}
                      </span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-steel/10 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsProdiModalOpen(false);
                  setProdiSearch("");
                }}
                className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PICKER: SKILLS / KEALIAN ==================== */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans text-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-steel/20 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-steel/10">
              <h3 className="font-display text-base font-bold text-ink">Cari Keahlian / Skill</h3>
              <button
                onClick={() => {
                  setIsSkillModalOpen(false);
                  setSkillSearch("");
                }}
                className="text-steel hover:text-ink transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="my-3 relative">
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Cari atau tambahkan skill..."
                className="w-full rounded-xl border border-steel/20 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-bridge-gold bg-white"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-steel/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 max-h-60 pr-1 py-1 font-mono text-xs">
              {isSkillSearchEmpty && (
                <button
                  type="button"
                  disabled={isCreatingCustom}
                  onClick={() => handleAddCustomSkill(skillSearch)}
                  className="w-full text-left p-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50/20 text-emerald-800 font-bold hover:bg-emerald-50/40 transition block text-[11px]"
                >
                  {isCreatingCustom ? "Menambahkan..." : `+ Tambahkan "${skillSearch}" sebagai kustom`}
                </button>
              )}

              {searchedSkillOptions.length === 0 && !isSkillSearchEmpty ? (
                <div className="py-4 text-center text-[11px] text-steel">
                  Tidak ada keahlian yang cocok.
                </div>
              ) : (
                searchedSkillOptions.map((s) => {
                  const isSelected = formData.selectedSkillIds.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        isSelected ? "bg-bridge-gold text-ink font-semibold" : "bg-steel/5 text-ink hover:bg-steel/15"
                      }`}
                    >
                      <span>{s.nama_skill}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-steel/10 text-right">
              <button
                type="button"
                onClick={() => {
                  setIsSkillModalOpen(false);
                  setSkillSearch("");
                }}
                className="rounded-full bg-ink px-5 py-2 font-mono text-[10px] font-bold text-white hover:bg-steel"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() => {
          setSuccessModal(prev => ({ ...prev, isOpen: false }));
          if (successModal.redirectOnClose) {
            router.push("/perusahaan/kolaborasi");
          }
        }}
      />
    </main>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

function SuccessModal({ isOpen, title, message, onClose }: SuccessModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans text-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-steel/20 text-center space-y-4 animate-fade-in animate-duration-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold text-ink">{title}</h3>
          <p className="font-mono text-[11px] text-steel leading-relaxed">{message}</p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-ink py-2.5 font-mono text-[10px] font-bold text-white hover:bg-steel transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
