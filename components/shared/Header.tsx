'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, User, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useThemeContext } from '@/components/shared/ThemeContext';

export function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-40 border-b border-tfa-border bg-tfa-bg-secondary">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-tfa-text-primary">
              TFA Farm OS
            </h1>
            <p className="text-xs text-tfa-text-muted">
              Steelpoort Nursery Operations
            </p>
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tfa-text-muted" />
            <Input
              type="search"
              placeholder="Search plots, activities..."
              className="pl-9 bg-tfa-bg-tertiary border-tfa-border"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="border-t border-tfa-border p-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tfa-text-muted" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 bg-tfa-bg-tertiary border-tfa-border"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
