import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'findr.campus - Modern Campus Lost & Found',
  description: 'The hyper-local campus recovery grid reconnecting university students, faculty, and security personnel with misplaced essentials in minutes.',
  openGraph: {
    title: 'findr.campus - Modern Campus Lost & Found',
    description: 'The hyper-local campus recovery grid reconnecting university students, faculty, and security personnel with misplaced essentials in minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'findr.campus - Modern Campus Lost & Found',
    description: 'The hyper-local campus recovery grid reconnecting university students, faculty, and security personnel with misplaced essentials in minutes.',
  },
};

import { AuthProvider } from '@/context/auth-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-surface text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
