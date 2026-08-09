// middleware.ts  (taruh di root project, sejajar sama app/)
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route yang butuh login
const PROTECTED = [
  "/dashboard",
  "/profil",
  "/pengajuan",
  "/status",
  "/perusahaan/dashboard",
  "/admin/dashboard",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

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
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected = PROTECTED.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !session) {
    // Redirect ke home, buka modal login otomatis lewat query param
    const url = new URL("/", req.url);
    url.searchParams.set("auth", "login");
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profil/:path*",
    "/pengajuan/:path*",
    "/status/:path*",
    "/perusahaan/:path*",
    "/admin/:path*",
  ],
};