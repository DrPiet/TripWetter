import type { Metadata } from 'next';
import { QueryProvider } from '@/components/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'TripWetter – Reiseplanung mit Wetterdaten',
  description:
    'Plane deine Reiseetappen und sieh automatisch die Wetterdaten für jeden Aufenthaltsort.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
