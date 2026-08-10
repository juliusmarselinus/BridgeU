import type { DashboardApiResponse, StoredUser, Pengajuan } from "../types/dashboard";

export async function fetchDashboardDataFromApi(accessToken: string): Promise<DashboardApiResponse | null> {
  try {
    const res = await fetch("/api/dashboard", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data: DashboardApiResponse = await res.json();
    return data;
  } catch (err) {
    console.error("Dashboard service error:", err);
    return null;
  }
}

export async function fetchUserProfileFromApi(accessToken: string): Promise<StoredUser | null> {
  try {
    const res = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      nama: data.nama,
      universitas: data.universitas,
      prodi: data.prodi,
      fotoUrl: data.fotoUrl,
      skills: data.skills ?? [],
      minatKategori: data.minatKategori ?? [],
    };
  } catch (err) {
    console.error("User profile service error:", err);
    return null;
  }
}

export function getStoredPengajuan(): Pengajuan[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("bridgeu_pengajuan");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse bridgeu_pengajuan from localStorage:", e);
    }
  }
  return [];
}
