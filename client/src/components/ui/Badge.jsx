import { cn } from '../../lib/cn';

const styles = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  high: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

export function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        styles[variant] || styles.default,
        className
      )}
    >
      {children}
    </span>
  );
}
