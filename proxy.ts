import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const pathname = req.nextUrl.pathname;

  // Halaman publik yang dapat diakses pengguna tanpa login (Home & Registration)
  const isPublicRoute = pathname === "/" || pathname === "/daftar";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Jika belum login
  if (!user) {
    if (isPublicRoute) {
      return response;
    }
    // Semua halaman selain publik dialihkan ke /?auth=login
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set("auth", "login");
    const redirectRes = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((c) => {
      redirectRes.cookies.set(c.name, c.value, c);
    });
    return redirectRes;
  }

  // 2. Jika sudah login, ambil role dari user_metadata atau tabel users database
  let role = user.user_metadata?.role;
  if (!role) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = userData?.role || "mahasiswa";
  }

  const lowerRole = role.toLowerCase();

  // Route groupings
  const isPerusahaanRoute = pathname.startsWith("/perusahaan");
  const isAdminRoute = pathname.startsWith("/admin");
  const isMahasiswaRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/status") ||
    pathname.startsWith("/kolaborasi") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/profile");

  let redirectTarget: string | null = null;

  // Role-Based Access Control (RBAC) rules
  if (lowerRole === "mahasiswa") {
    // Mahasiswa tidak boleh akses rute perusahaan atau admin
    if (isPerusahaanRoute || isAdminRoute) {
      redirectTarget = "/dashboard";
    }
  } else if (lowerRole === "perusahaan") {
    // Perusahaan tidak boleh akses rute admin atau mahasiswa
    if (isAdminRoute || isMahasiswaRoute) {
      redirectTarget = "/perusahaan/dashboard";
    }
  } else if (lowerRole === "admin") {
    // Admin tidak boleh akses rute perusahaan atau mahasiswa
    if (isPerusahaanRoute || isMahasiswaRoute) {
      redirectTarget = "/admin/dashboard";
    }
  }

  // Jika sudah login tetapi mencoba akses /daftar
  if (pathname === "/daftar") {
    if (lowerRole === "perusahaan") redirectTarget = "/perusahaan/dashboard";
    else if (lowerRole === "admin") redirectTarget = "/admin/dashboard";
    else redirectTarget = "/dashboard";
  }

  if (redirectTarget && pathname !== redirectTarget) {
    const redirectUrl = new URL(redirectTarget, req.url);
    const redirectRes = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((c) => {
      redirectRes.cookies.set(c.name, c.value, c);
    });
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Jalankan proxy untuk semua rute KECUALI:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - file dengan ekstensi gambar/media (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
