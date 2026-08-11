export type VerifikasiStatus = "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak";

export interface RegisteredCompany {
  id: string;
  nama: string;
  industri: string;
  lokasi: string;
  statusVerifikasi: VerifikasiStatus;
  nib: string;
  email: string;
  tanggalDaftar: string;
}
