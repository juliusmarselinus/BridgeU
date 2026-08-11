export type UserRole = "Mahasiswa" | "Perusahaan";
export type UserStatus = "Aktif" | "Suspended";

export interface ManagedUser {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  detail: string;
  tanggalGabung: string;
}
