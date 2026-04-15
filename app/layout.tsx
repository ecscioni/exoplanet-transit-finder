import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/shell/app-shell';

export const metadata: Metadata = {
  title: 'Exoplanet Transit Finder',
  description: 'Interactive exoplanet transit learning and vetting experience',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
