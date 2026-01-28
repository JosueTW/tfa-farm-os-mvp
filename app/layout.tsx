import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeContextProvider } from '@/components/shared/ThemeContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TFA Farm Operations System',
  description: 'AI-powered farm operations monitoring and command center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}
