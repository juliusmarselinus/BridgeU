"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { allCategoriesList, allSkillsList, badgeList } from "@/lib/dummy-data";

type StoredUser = {
  nama: string;
  email: string;
  universitas?: string;
  prodi?: string;
  semester?: string;
  minatKategori?: string[];
  skills?: string[];
  preferensiTipe?: string;
  preferensiLokasi?: string;
  ringkasan?: string;
  foto?: string;
};

type Pengajuan = {
  id: string;
  judul: string;
  perusahaan: string;
  status: string;
  tujuan: string;
  tanggal: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/* ------------------------------------------------------------------ */
/* Modal Success Animated Pop-up                                       */
/* ------------------------------------------------------------------ */
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-slate-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl mb-4 shadow-inner">
          ✓
        </div>
        <h3 className="text-xl font-bold text-slate-900">Berhasil Disimpan! 🎉</h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Perubahan profil kamu telah diperbarui dan siap ditampilkan.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition active:scale-95"
        >
          Mantap, Siap! 🚀
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal Edit Photo                                                   */
/* ------------------------------------------------------------------ */
function EditPhotoModal({
  imageSrc,
  onClose,
  onSave,
}: {
  imageSrc: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const PREVIEW_SIZE = 240;

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({ x: dragState.current.origX + dx, y: dragState.current.origY + dy });
  };

  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const OUTPUT = 400;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const scaleRatio = OUTPUT / PREVIEW_SIZE;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const baseScale = Math.max(PREVIEW_SIZE / naturalW, PREVIEW_SIZE / naturalH);
    const appliedScale = baseScale * (zoom / 100);

    const drawW = naturalW * appliedScale * scaleRatio;
    const drawH = naturalH * appliedScale * scaleRatio;

    ctx.translate(OUTPUT / 2 + offset.x * scaleRatio, OUTPUT / 2 + offset.y * scaleRatio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Edit Foto Profil 📸</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 pt-5">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50 shadow-inner"
            style={{
              width: PREVIEW_SIZE,
              height: PREVIEW_SIZE,
              cursor: dragState.current.dragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Preview foto"
              draggable={false}
              className="absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom / 100})`,
                width: "auto",
                height: PREVIEW_SIZE,
                objectFit: "cover",
              }}
            />
          </div>

          <div className="flex w-full items-center gap-3">
            <span className="text-xs text-slate-400">−</span>
            <input
              type="range"
              min={50}
              max={200}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
            />
            <span className="text-xs text-slate-400">+</span>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-slate-500">{zoom}%</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handleRotate}
              aria-label="Putar gambar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              ↻
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper Component                                                   */
/* ------------------------------------------------------------------ */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Profile Page Component                                        */
/* ------------------------------------------------------------------ */
export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fileError, setFileError] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "pencapaian" | "pengajuan">("profile");
  const fotoInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [universitas, setUniversitas] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [preferensiTipe, setPreferensiTipe] = useState("Semua");
  const [preferensiLokasi, setPreferensiLokasi] = useState("Remote");
  const [ringkasan, setRingkasan] = useState("");
  const [foto, setFoto] = useState("");
  const [minatKategori, setMinatKategori] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);

  const loadFromStorage = () => {
    const stored = localStorage.getItem("bridgeu_user");
    if (stored) {
      const parsed: StoredUser = JSON.parse(stored);
      setUser(parsed);
      setNama(parsed.nama || "");
      setEmail(parsed.email || "");
      setUniversitas(parsed.universitas || "");
      setProdi(parsed.prodi || "");
      setSemester(parsed.semester || "");
      setPreferensiTipe(parsed.preferensiTipe || "Semua");
      setPreferensiLokasi(parsed.preferensiLokasi || "Remote");
      setRingkasan(parsed.ringkasan || "");
      setFoto(parsed.foto || "");
      setMinatKategori(parsed.minatKategori || []);
      setSkills(parsed.skills || []);
    }
  };

  useEffect(() => {
    loadFromStorage();

    const storedPengajuan = localStorage.getItem("bridgeu_pengajuan");
    if (storedPengajuan) {
      try {
        const parsedPengajuan = JSON.parse(storedPengajuan);
        queueMicrotask(() => setPengajuan(parsedPengajuan));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleMinat = (m: string) => {
    setMinatKategori((prev) => (prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]));
  };

  const toggleSkill = (s: string) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]));
  };

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("File harus berupa gambar (JPG, PNG). ⚠️");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran gambar maksimal 5MB. ⚠️");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.onerror = () => setFileError("Gagal membaca file gambar.");
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleModalSave = (dataUrl: string) => {
    setFoto(dataUrl);
    setPendingImage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoredUser = {
      ...user,
      nama,
      email,
      universitas,
      prodi,
      semester,
      preferensiTipe,
      preferensiLokasi,
      ringkasan,
      foto,
      minatKategori,
      skills,
    } as StoredUser;

    localStorage.setItem("bridgeu_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("bridgeu_user_updated"));
    setUser(updated);
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    loadFromStorage();
    setIsEditing(false);
    setFileError("");
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-100/70">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-medium text-slate-500">
            Kamu belum masuk. Silakan masuk terlebih dahulu untuk melihat profil. 🔒
          </p>
        </div>
      </main>
    );
  }

  const inisial = nama ? nama.trim().charAt(0).toUpperCase() : "?";
  const totalPengajuan = pengajuan.length;
  const diterima = pengajuan.filter((p) => p.status === "Diterima" || p.status === "Selesai").length;
  const level = Math.floor(totalPengajuan / 2) + 1;
  const earnedBadges = badgeList.filter((b) => b.check(totalPengajuan, diterima));
  const lockedBadges = badgeList.filter((b) => !b.check(totalPengajuan, diterima));

  return (
    <main className="min-h-screen bg-slate-100/70 text-slate-900 pb-20">
      <Navbar />

      {/* Pop-up Modal Sukses */}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

      {/* Modal Edit Foto */}
      {pendingImage && (
        <EditPhotoModal
          imageSrc={pendingImage}
          onClose={() => setPendingImage(null)}
          onSave={handleModalSave}
        />
      )}

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {fileError && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 shadow-sm">
            {fileError}
          </div>
        )}

        <form id="profile-form" onSubmit={handleSave}>
         
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
            
            {/* Banner Cover Gradient */}
            <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
              {/* Optional Decorative Elements */}
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-2xl" />
            </div>

            {/* Content Under Banner */}
            <div className="px-6 pb-4 pt-0 sm:px-8">
              
              <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between relative -mt-16 sm:-mt-20 gap-4">
                
                {/* Left Stats (Desktop) */}
                <div className="hidden md:flex items-center gap-8 mb-2">
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900">{skills.length}</p>
                    <p className="text-[11px] font-medium text-slate-400">Skills</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-slate-900">{minatKategori.length}</p>
                    <p className="text-[11px] font-medium text-slate-400">Minat</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-600">Lvl {level}</p>
                    <p className="text-[11px] font-medium text-slate-400">Mahasiswa</p>
                  </div>
                </div>

                {/* Avatar Center */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="h-28 w-28 sm:h-36 sm:w-36 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl">
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={foto} alt="Foto profil" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-slate-400">
                          {inisial}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => fotoInputRef.current?.click()}
                          aria-label="Edit foto"
                          className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-lg transition hover:scale-105"
                        >
                          ✏️
                        </button>
                        <input ref={fotoInputRef} type="file" accept="image/*" onChange={readFile} className="hidden" />
                      </>
                    )}
                  </div>
                </div>

                {/* Right Actions / Edit Button */}
                <div className="flex items-center gap-2 mb-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-95"
                    >
                      Edit Profil ✏️
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-95"
                      >
                        Simpan 💾
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* User Identity Center Text */}
              <div className="mt-3 text-center">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{nama || "Nama Kamu"}</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {[prodi, universitas].filter(Boolean).join(" • ") || email}
                </p>
              </div>

              {/* Mobile Stats Bar */}
              <div className="md:hidden mt-5 grid grid-cols-3 divide-x divide-slate-100 border-t border-b border-slate-100 py-3 text-center">
                <div>
                  <p className="text-base font-bold text-slate-900">{skills.length}</p>
                  <p className="text-[10px] text-slate-400">Skills</p>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">{minatKategori.length}</p>
                  <p className="text-[10px] text-slate-400">Minat</p>
                </div>
                <div>
                  <p className="text-base font-bold text-amber-600">Lvl {level}</p>
                  <p className="text-[10px] text-slate-400">Level</p>
                </div>
              </div>

              {/* Tab Navigation (MatDash Style) */}
              <div className="mt-6 flex justify-center border-t border-slate-100 pt-2">
                <div className="flex gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "profile"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    👤 Detail Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pencapaian")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "pencapaian"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🏆 Pencapaian
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pengajuan")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "pengajuan"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🚀 Status Kolaborasi
                  </button>
                </div>
              </div>

            </div>
          </div>

          
          <div className="mt-6">
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* Left Card: Summary / Intro */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Ringkasan & Bio 📝</h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {ringkasan || "Belum ada ringkasan atau deskripsi diri yang ditambahkan."}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Informasi Tambahan 📌</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tipe Kolaborasi</p>
                        <p className="text-xs font-semibold text-slate-800 mt-0.5">{preferensiTipe}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sistem Kerja</p>
                        <p className="text-xs font-semibold text-slate-800 mt-0.5">{preferensiLokasi}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Main Info Form / Details */}
                <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                    {isEditing ? "Edit Informasi Akun ✏️" : "Informasi Akun Lengkap 📋"}
                  </h3>

                  {!isEditing ? (
                    /* VIEW MODE */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <InfoField label="Nama Lengkap" value={nama} />
                        <InfoField label="Email" value={email} />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-slate-100 pt-5">
                        <InfoField label="Universitas" value={universitas} />
                        <InfoField label="Program Studi" value={prodi} />
                        <InfoField label="Semester" value={semester} />
                      </div>

                      <div className="border-t border-slate-100 pt-5">
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Kategori Proyek Minat 🎯</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {minatKategori.length > 0 ? (
                            minatKategori.map((m) => (
                              <span key={m} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
                                ✓ {m}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400">Belum ada minat dipilih.</p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-5">
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Skill & Tools 🛠️</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {skills.length > 0 ? (
                            skills.map((s) => (
                              <span key={s} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
                                # {s}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400">Belum ada skill ditambahkan.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* EDIT MODE */
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Nama Lengkap</label>
                          <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Universitas</label>
                          <input
                            type="text"
                            value={universitas}
                            onChange={(e) => setUniversitas(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Program Studi</label>
                          <input
                            type="text"
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Semester</label>
                          <input
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Kategori Proyek Minat 🎯</label>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {allCategoriesList.map((m) => {
                            const selected = minatKategori.includes(m);
                            return (
                              <button
                                type="button"
                                key={m}
                                onClick={() => toggleMinat(m)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                  selected
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {selected ? "✓ " : "+ "}
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Skill & Tools 🛠️</label>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {allSkillsList.map((s) => {
                            const selected = skills.includes(s);
                            return (
                              <button
                                type="button"
                                key={s}
                                onClick={() => toggleSkill(s)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                  selected
                                    ? "bg-amber-500 text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {selected ? "✓ " : "# "}
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Preferensi Tipe Kolaborasi</label>
                          <select
                            value={preferensiTipe}
                            onChange={(e) => setPreferensiTipe(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          >
                            <option value="Semua">Semua</option>
                            <option value="Akademik">Hanya Studi Kasus / Riset</option>
                            <option value="Magang">Hanya Magang</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Preferensi Sistem Kerja</label>
                          <select
                            value={preferensiLokasi}
                            onChange={(e) => setPreferensiLokasi(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                          >
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Onsite">Onsite</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Ringkasan Pengalaman & Motivasi 📝</label>
                        <textarea
                          rows={3}
                          value={ringkasan}
                          onChange={(e) => setRingkasan(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeTab === "pencapaian" && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                  Pencapaian & Badge 🏆
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {earnedBadges.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                      <p className="text-sm font-bold text-slate-900">🏆 {b.nama}</p>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{b.deskripsi}</p>
                      <span className="mt-3 inline-block rounded-lg bg-amber-200/80 px-2.5 py-1 text-[10px] font-bold text-amber-900">
                        Unlocked
                      </span>
                    </div>
                  ))}
                  {lockedBadges.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 opacity-60">
                      <p className="text-sm font-bold text-slate-600">🔒 {b.nama}</p>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{b.deskripsi}</p>
                      <span className="mt-3 inline-block rounded-lg bg-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-500">
                        Terkunci
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "pengajuan" && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-base font-bold text-slate-900">
                    Riwayat Kolaborasi 🚀
                  </h3>
                  <Link href="/kolaborasi" className="text-xs font-semibold text-indigo-600 hover:underline">
                    Cari Peluang →
                  </Link>
                </div>

                {pengajuan.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {pengajuan.map((p) => (
                      <div key={p.id} className="py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{p.judul}</p>
                          <p className="text-xs text-slate-500">{p.perusahaan} • {p.tanggal}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">Belum ada riwayat kolaborasi.</p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}