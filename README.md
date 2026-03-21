# Maza Online Platform (منصة ماذا)

منصة رقمية متكاملة مخصصة لدعم أسر ذوي الاحتياجات الخاصة والأطفال العاديين وتقديم حلول التخاطب وتعديل السلوك وتنمية المهارات والاستشارات النفسية.

## التقنيات المستخدمة (Tech Stack)
- **Frontend & Backend:** Next.js (App Router)
- **Styling:** Vanilla CSS (Glassmorphism & Dark Mode)
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** NextAuth.js
- **Artificial Intelligence:** Google Gemini AI (1.5 Pro)
- **Video Calling:** Daily.co Prebuilt API

## خطوات النشر (Deployment Steps)

1. **قاعدة البيانات (Database):**
   - قم بالدخول إلى [Supabase](https://supabase.com) أو [Neon.tech](https://neon.tech) لإنشاء قاعدة بيانات PostgreSQL مجانية.
   - انسخ رابط `DATABASE_URL` وأضفه لمتغيرات البيئة.

2. **النشر السحابي (Cloud Hosting):**
   - قم برفع هذا المشروع إلى حسابك على GitHub.
   - ادخل إلى [Vercel](https://vercel.com) أو [Netlify](https://netlify.com) واعمل Import للمشروع.
   - أضف المتغيرات البيئية التالية في إعدادات المنصة:
     ```env
     DATABASE_URL="postgres://..."
     NEXTAUTH_SECRET="your-secret-key"
     GEMINI_API_KEY="your-gemini-key"
     ```
   - اضغط على Deploy!

## التشغيل المحلي (Local Development)
لبدء السيرفر محلياً بغرض التطوير:
```bash
npm install
npx prisma generate
npm run dev
```
