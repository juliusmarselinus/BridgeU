import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL atau Anon Key tidak ditemukan di file .env!')
}

export const COOKIE_MAX_AGE_7_DAYS = 7 * 24 * 60 * 60 // 7 hari (604.800 detik)

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookieOptions: {
    maxAge: COOKIE_MAX_AGE_7_DAYS,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})

// Dipakai di route.ts: client yang "bawa" token milik user, biar query
// (update/insert/delete) dianggap RLS sebagai user itu sendiri — bukan anon.
export function getAuthedClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}