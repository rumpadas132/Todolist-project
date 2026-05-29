import { NavLink } from 'react-router-dom';
import { CheckSquare2, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const linkClass =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors';

export function Sidebar({ onNavigate }) {
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/80 bg-white/90 px-4 py-6 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <CheckSquare2 className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">Taskflow</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Stay organized</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              linkClass,
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )
          }
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          Dashboard
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className={cn(linkClass, 'mt-auto text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40')}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        Logout
      </button>
    </aside>
  );
}
