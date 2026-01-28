'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Activity,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Plots',
    href: '/dashboard/plots',
    icon: Map,
  },
  {
    title: 'Activities',
    href: '/dashboard/activities',
    icon: Activity,
  },
  {
    title: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Check if we're on a sub-page (not on dashboard/overview)
  const isOnSubPage = pathname !== '/' && pathname !== '/dashboard';

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-tfa-border bg-tfa-bg-secondary transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-tfa-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-tfa-primary to-tfa-primary-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">TFA</span>
            </div>
            <span className="font-semibold text-tfa-text-primary">Farm OS</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-tfa-primary to-tfa-primary-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">TFA</span>
            </div>
          </Link>
        )}
      </div>

      {/* Back to Dashboard Button - shown when on sub-pages */}
      {isOnSubPage && (
        <div className="p-3 border-b border-tfa-border">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-start gap-2 text-tfa-primary hover:bg-tfa-primary/10',
              collapsed && 'justify-center px-2'
            )}
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            {!collapsed && <span>Back to Overview</span>}
          </Button>
        </div>
      )}

      {/* Quick Add Button */}
      <div className="p-3">
        <Link
          href="/dashboard/add-media"
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
            'bg-[#01AB93] text-white hover:bg-[#01E3C2] shadow-md hover:shadow-lg',
            pathname === '/dashboard/add-media' && 'ring-2 ring-tfa-accent/50',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Quick Add Media' : undefined}
        >
          <PlusCircle className="h-5 w-5" />
          {!collapsed && <span>Quick Add</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 pt-0">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-tfa-primary/10 text-tfa-primary'
                  : 'text-tfa-text-secondary dark:text-tfa-text-muted hover:bg-tfa-bg-tertiary hover:text-tfa-text-primary',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn('h-5 w-5', active && 'text-tfa-primary')} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-tfa-border p-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-tfa-text-muted transition-colors hover:bg-tfa-bg-tertiary hover:text-tfa-text-primary',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          className={cn('mt-2 w-full', collapsed && 'px-2')}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
