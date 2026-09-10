import type { Metadata } from 'next';
import { ADLaM_Display, Manrope } from 'next/font/google';
import { AdminShell } from '@/components/admin/AdminShell';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-admin-sans',
});

const adlamDisplay = ADLaM_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-admin-display',
});

export const metadata: Metadata = {
  title: {
    default: 'BKSR Content Studio',
    template: '%s · BKSR CMS',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${manrope.variable} ${adlamDisplay.variable} font-[family-name:var(--font-admin-sans)]`}
    >
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
