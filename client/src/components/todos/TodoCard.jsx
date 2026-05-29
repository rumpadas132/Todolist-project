import { format, isBefore, isSameDay, startOfDay } from 'date-fns';
import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../lib/cn';

function dueLabel(dueDate) {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  const label = format(d, 'MMM d, yyyy');
  const today = startOfDay(new Date());
  const dueDay = startOfDay(d);
  if (isSameDay(d, new Date())) return { text: 'Due today', urgent: true };
  const overdue = isBefore(dueDay, today);
  return { text: overdue ? `Overdue · ${label}` : `Due ${label}`, urgent: overdue };
}

export function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const due = dueLabel(todo.dueDate);

  return (
    <div
      className={cn(
        'group flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80',
        todo.completed && 'opacity-70'
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(todo)}
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition',
          todo.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-brand-500 dark:border-slate-600'
        )}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              'font-semibold text-slate-900 dark:text-white',
              todo.completed && 'line-through decoration-slate-400'
            )}
          >
            {todo.title}
          </h3>
          <Badge variant={todo.priority}>{todo.priority}</Badge>
        </div>
        {todo.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{todo.description}</p>
        )}
        {due && (
          <p
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 text-xs font-medium',
              due.urgent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            {due.text}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row sm:items-start">
        <Button variant="ghost" size="sm" className="!px-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" type="button" onClick={() => onEdit(todo)} aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="!px-2 text-rose-600 opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/40 sm:opacity-0 sm:group-hover:opacity-100" type="button" onClick={() => onDelete(todo)} aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
