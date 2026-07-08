# ABS Beyni Tamiri ve Satışı

Profesyonel kurumsal web sitesi — Landing Page, Blog ve Yönetim Paneli.

## Teknolojiler

- Next.js 15+ (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- Prisma ORM (PostgreSQL)
- NextAuth
- shadcn/ui

## Kurulum

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

## Ortam Değişkenleri

`.env.example` dosyasındaki değişkenleri `.env` dosyasına kopyalayın.

## Admin Girişi

Seed çalıştırmadan önce `.env` dosyasında `ADMIN_EMAIL` ve `ADMIN_PASSWORD` tanımlayın:

```bash
ADMIN_EMAIL="admin@abscimustafa.com.tr"
ADMIN_PASSWORD="your-strong-password"
npm run db:seed
```

## Font Dosyaları

Charlie Display ve Charlie Text fontlarını şu konumlara ekleyin:

- `public/fonts/charlie-display/`
- `public/fonts/charlie-text/`

Ardından `app/globals.css` içindeki `@font-face` yorumlarını kaldırın.

## Placeholder Görseller

- `public/images/about.jpg` — Hakkımızda görseli
- `public/images/references/` — Referans logoları
- `public/images/blog/` — Blog kapak görselleri
- `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` — Hero video ID

## Deploy (Vercel)

1. PostgreSQL veritabanı oluşturun
2. `DATABASE_URL` ortam değişkenini ayarlayın
3. `AUTH_SECRET` oluşturun: `openssl rand -base64 32`
4. Deploy sonrası: `npx prisma db push && npx tsx prisma/seed.ts`
