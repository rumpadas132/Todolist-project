import { ClipboardList } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Friendly empty state with simple “illustration” using Lucide icon art.
 */
export function EmptyState({ icon: Icon = ClipboardList, title, description, className, children }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-8 py-16 text-center dark:border-slate-800 dark:bg-slate-900/40',
        className
      )}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-indigo-500/10 text-brand-600 dark:from-brand-400/20 dark:to-indigo-400/10 dark:text-brand-300">
        <Icon className="h-10 w-10" strokeWidth={1.25} />
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
