This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Animations & Interactive Components

Landing page BridgeU menggunakan beberapa komponen animasi berbasis scroll:

| Komponen | Lokasi | Fungsi |
|---|---|---|
| `ScrollReveal` | `components/ScrollReveal.tsx` | Wrapper fade-in + slide-up saat elemen masuk viewport (pakai IntersectionObserver) |
| `ProgramsSection` | `components/ProgramsSection.tsx` | Section "Kolaborasi Akademik" di homepage, pakai `ScrollReveal` |
| `HeroScrollSection` | `components/HeroScrollSection.tsx` | Preview mockup platform dengan efek parallax zoom saat discroll |
| `container-scroll-animation` | `components/ui/container-scroll-animation.tsx` | Primitive animasi scroll (dipakai `HeroScrollSection`) |
| `resizable-navbar` | `components/ui/resizable-navbar.tsx` | Navbar yang mengecil jadi floating pill saat discroll, dengan animasi mobile menu |

Background halaman (`body` di `app/globals.css`) juga punya animasi gradient transition yang subtle, otomatis nonaktif kalau user punya setting `prefers-reduced-motion`.

### Dependency tambahan

Semua komponen di atas butuh package berikut (install sekali via `npm install`):

```bash
npm install framer-motion clsx tailwind-merge lucide-react
```

`lib/utils.ts` berisi helper `cn()` (gabungan `clsx` + `tailwind-merge`) yang dipakai oleh semua komponen di atas — jangan dihapus.