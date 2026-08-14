import { useState, useEffect } from "react";
import { StatusItem, PAGE_SIZE, TabKey } from "../types/status";
import { fetchMahasiswaStatusList } from "../services/statusService";

export function useStatusList() {
  const [list, setList] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("semua");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchMahasiswaStatusList();
      setList(data);
      setLoading(false);
    }

    loadData();
  }, []);

  return {
    list,
    setList,
    loading,
    tab,
    setTab,
    query,
    setQuery,
    visibleCount,
    setVisibleCount,
  };
}
