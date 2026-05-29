import { cn } from '../../lib/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-card backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-card-dark',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
