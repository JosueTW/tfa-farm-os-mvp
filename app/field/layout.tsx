'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Camera, Mic, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/field', icon: Home, label: 'Home' },
  { href: '/field/tasks', icon: CheckSquare, label: 'Tasks' },
];

export default function FieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  // In production, listen to online/offline events
  // useEffect(() => {
  //   const handleOnline = () => setIsOnline(true);
  //   const handleOffline = () => setIsOnline(false);
  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);
  //   return () => {
  //     window.removeEventListener('online', handleOnline);
  //     window.removeEventListener('offline', handleOffline);
  //   };
  // }, []);

  return (
    <div className="flex min-h-screen flex-col bg-tfa-bg-primary">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-warning px-4 py-2 text-center text-sm text-white">
          Offline Mode — Data will sync when connected
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-tfa-border bg-tfa-bg-secondary px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-tfa-primary" />
            <span className="font-bold text-tfa-text-primary">TFA Field</span>
          </div>
          {isOnline ? (
            <span className="flex items-center gap-1 text-xs text-tfa-primary">
              <span className="h-2 w-2 rounded-full bg-tfa-primary" />
              Online
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-warning">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Offline
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-tfa-border bg-tfa-bg-secondary">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors',
                  isActive
                    ? 'text-tfa-accent'
                    : 'text-tfa-text-muted hover:text-tfa-text-primary'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
