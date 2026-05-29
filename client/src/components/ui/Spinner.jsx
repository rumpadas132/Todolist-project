import { cn } from '../../lib/cn';

export function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
