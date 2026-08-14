import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Kolaborasi } from "@/lib/types";
import { fetchKolaborasiFromSupabase } from "../services/kolaborasiService";
import {
  fetchMahasiswaMatchProfile,
  rankKolaborasiByMatch,
  MahasiswaMatchProfile,
} from "@/lib/matching";

export function useKolaborasiList() {
  const [items, setItems] = useState<Kolaborasi[]>([]);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);

      const [kolabList, userRes] = await Promise.all([
        fetchKolaborasiFromSupabase(),
        supabase.auth.getUser(),
      ]);

      if (!isMounted) return;
      setItems(kolabList);

      const user = userRes.data?.user;
      if (user && kolabList.length > 0) {
        const mProfile: MahasiswaMatchProfile | null = await fetchMahasiswaMatchProfile();
        if (mProfile && isMounted) {
          const ranked = rankKolaborasiByMatch(kolabList, mProfile);
          const scoreMap: Record<string, number> = {};
          ranked.forEach((r) => {
            scoreMap[r.id] = r.match.score;
          });
          setMatchScores(scoreMap);
        }
      }

      if (isMounted) setIsLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    items,
    matchScores,
    isLoading,
  };
}
