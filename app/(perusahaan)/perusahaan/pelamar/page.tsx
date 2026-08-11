"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PelamarRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/perusahaan/kolaborasi");
  }, [router]);

  return (
    <div className="flex h-96 items-center justify-center font-mono text-xs text-steel">
      Mengalihkan...
    </div>
  );
}