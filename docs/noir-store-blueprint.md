# Noir-Store Blueprint (Next.js 14 + Prisma + Clerk)

## Scalable Folder Structure

```txt
.
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (store)/
│   │   ├── page.tsx
│   │   ├── products/[slug]/page.tsx
│   │   ├── categories/[category]/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── profile/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── products/new/page.tsx
│   ├── api/
│   │   ├── admin/products/route.ts
│   │   ├── products/route.ts
│   │   └── wishlist/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn components
│   ├── product/product-card.tsx
│   ├── product/search-bar.tsx      # debounced search + category sorting
│   └── layout/top-nav.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── cloudinary.ts               # or r2.ts
│   └── validators/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts
├── tailwind.config.ts
└── next.config.mjs
```

## Search / Wishlist Notes
- Search UX should debounce for ~250ms on input and then call `/api/products?query=&category=&sort=`.
- Wishlist should be persisted with `@@unique([userId, productId])` and toggled via authenticated API route.
- Restrict `/admin/**` in `middleware.ts` to users with `role=ADMIN` claim.
