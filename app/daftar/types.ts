export interface FormDataState {
  role: "mahasiswa" | "perusahaan" | "";
  // Field Akun (Shared)
  email: string;
  password: string;
  confirmPassword: string;
  nama: string; // Nama Lengkap (Mahasiswa) atau Nama Perusahaan (Perusahaan)

  // Field khusus Mahasiswa
  universitas: string;
  prodi: string;
  semester: string;
  preferensiTipe: string;
  preferensiLokasi: string;
  ringkasanSelf: string;
  selectedSkills: string[];
  selectedMinat: string[];
  customUnivInput: string;
  customProdiInput: string;
  isCustomUniv: boolean;
  isCustomProdi: boolean;

  // Field khusus Perusahaan (sesuai dbs.sql)
  namaPerusahaan: string;
  industri: string;
  nib: string;
  lokasiPerusahaan: string;
  deskripsiPerusahaan: string;
  fokusKolaborasi: string[];
  sektorId: number;
  kotaId: number;
  ukuranPerusahaan: string;
  tahunBerdiri: string;
  logoUrl: string;
  situsWeb: string;
  alamatLengkap: string;
}

export interface StepItem {
  num: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ModalPickerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (val: string) => void;
  allowLainnya?: boolean;
}
