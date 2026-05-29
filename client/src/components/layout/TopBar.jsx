import { useState } from 'react';
import { Menu, Moon, Sun, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export function TopBar({ onMenuClick }) {
  const user = useAuthStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const apply = useThemeStore((s) => s.applyDocumentTheme);

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    queueMicrotask(() => apply());
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 lg:px-8">
      <button
        type="button"
        className="inline-flex rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="!px-2" type="button" onClick={cycleTheme} aria-label="Toggle theme">
          <ThemeIcon className="h-5 w-5" />
        </Button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
        <Link
          to="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-bold text-white shadow-md"
        >
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </Link>
      </div>
    </header>
  );
}
