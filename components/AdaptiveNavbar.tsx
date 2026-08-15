"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CompanyNavbar } from "@/components/CompanyNavbar";
import { supabase } from "@/lib/supabase";

export function AdaptiveNavbar() {
  const pathname = usePathname();
  const isProfileRoute = pathname?.startsWith("/profile");

  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(isProfileRoute);

  useEffect(() => {
    if (!isProfileRoute) return;

    let isMounted = true;
    setRoleLoading(true);

    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (isMounted) {
          setRole(null);
          setRoleLoading(false);
        }
        return;
      }

      let r = user.user_metadata?.role;
      if (!r) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        r = data?.role || "mahasiswa";
      }

      if (isMounted) {
        setRole(r.toLowerCase());
        setRoleLoading(false);
      }
    }

    checkRole();

    return () => {
      isMounted = false;
    };
  }, [isProfileRoute, pathname]);

  if (!isProfileRoute) {
    return <Navbar />;
  }

  if (roleLoading) {
    return null; // atau bisa taro skeleton navbar kalau mau
  }

  return role === "perusahaan" ? <CompanyNavbar /> : <Navbar />;
}