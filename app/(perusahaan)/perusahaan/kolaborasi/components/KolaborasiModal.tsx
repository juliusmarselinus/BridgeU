import { FormEvent } from "react";
import {
  KolaborasiFormData,
  KolaborasiTipe,
  TingkatKesulitan,
  KategoriMinatOption,
  KotaOption,
} from "../../dashboard/types/company";

interface KolaborasiModalProps {
  isOpen: boolean;
  formData: KolaborasiFormData;
  kategoriOptions?: KategoriMinatOption[];
  kotaOptions?: KotaOption[];
  onClose: () => void;
  onChange: (data: KolaborasiFormData) => void;
  onSubmit: (e: FormEvent) => void;
}

export function KolaborasiModal({
  isOpen,
  formData,
  kategoriOptions = [],
  kotaOptions = [],
  onClose,
  onChange,
  onSubmit,
}: KolaborasiModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-steel/20 my-8">
        <div className="flex items-center justify-between border-b border-steel/10 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              Buka Peluang Kolaborasi
            </h3>
            <p className="font-mono text-xs text-steel">
              Isi formulir untuk mengajukan proyek akademik atau posisi magang baru
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full bg-steel/10 p-2 text-steel hover:bg-steel/20 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Judul Proyek / Posisi Magang *
            </label>
            <input
              type="text"
              required
              value={formData.judul}
              onChange={(e) => onChange({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Optimasi Model AI untuk Klasifikasi Medis"
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
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
                  onChange({ ...formData, tipe: e.target.value as KolaborasiTipe })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
              >
                <option value="Akademik">Akademik (Riset/Tugas Akhir)</option>
                <option value="Magang">Magang (Proyek/Industri)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kategori Minat *
              </label>
              <select
                value={formData.kategori_id}
                onChange={(e) =>
                  onChange({ ...formData, kategori_id: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
              >
                {kategoriOptions.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kota Lokasi *
              </label>
              <select
                value={formData.lokasi_id}
                onChange={(e) =>
                  onChange({ ...formData, lokasi_id: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
              >
                {kotaOptions.map((k) => (
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
                  onChange({
                    ...formData,
                    tingkat_kesulitan: e.target.value as TingkatKesulitan,
                  })
                }
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm bg-white outline-none focus:border-bridge-gold"
              >
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Lanjut">Lanjut</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Kuota Slot *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.slot}
                onChange={(e) => onChange({ ...formData, slot: Number(e.target.value) })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
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
                onChange={(e) => onChange({ ...formData, batas_waktu: e.target.value })}
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-medium text-ink mb-1">
                Gaji / Stipend (Opsional)
              </label>
              <input
                type="text"
                value={formData.gaji_stipend || ""}
                onChange={(e) => onChange({ ...formData, gaji_stipend: e.target.value })}
                placeholder="Contoh: Rp 2.500.000 / bulan"
                className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-medium text-ink mb-1">
              Deskripsi Proyek & Kualifikasi *
            </label>
            <textarea
              rows={4}
              required
              value={formData.deskripsi}
              onChange={(e) => onChange({ ...formData, deskripsi: e.target.value })}
              placeholder="Jelaskan kebutuhan proyek, ekspektasi luaran, serta kualifikasi..."
              className="w-full rounded-xl border border-steel/20 px-4 py-2.5 text-sm outline-none focus:border-bridge-gold"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-steel/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 font-mono text-xs font-medium text-steel hover:bg-steel/10 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-bridge-gold px-6 py-2.5 font-mono text-xs font-semibold text-ink hover:bg-bridge-gold/90 shadow-md transition"
            >
              Ajukan Proyek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}