import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أكاديمية ماذا الرقمية',
    short_name: 'ماذا Maza',
    description: 'الحل الشامل لدعم الأسرة والأطفال والبالغين عبر الاستشارات وتقارير الذكاء الاصطناعي',
    start_url: '/welcome',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#6366f1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
