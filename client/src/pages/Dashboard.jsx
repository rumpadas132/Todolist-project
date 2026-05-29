import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createTodo, deleteTodo, fetchStats, fetchTodos, updateTodo } from '../services/todoService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { TodoCard } from '../components/todos/TodoCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { cn } from '../lib/cn';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

const SORTS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: 'dueDate', label: 'Due date (soonest)' },
  { value: '-dueDate', label: 'Due date (latest)' },
  { value: 'priority', label: 'Priority (high → low)' },
  { value: '-priority', label: 'Priority (low → high)' },
  { value: 'title', label: 'Title A–Z' },
  { value: '-title', label: 'Title Z–A' },
];

function StatCard({ label, value, hint, className }) {
  return (
    <Card className={cn('p-5', className)}>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </Card>
  );
}

const emptyTodo = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export function Dashboard() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('-createdAt');
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTodo);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const queryParams = useMemo(
    () => ({ search: debouncedSearch, filter, sort }),
    [debouncedSearch, filter, sort]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, s] = await Promise.all([fetchTodos(queryParams), fetchStats()]);
      setTodos(list);
      setStats(s);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyTodo);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (todo) => {
    setEditing(todo);
    setForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    };
    try {
      if (editing) {
        await updateTodo(editing.id, payload);
        toast.success('Todo updated');
      } else {
        await createTodo(payload);
        toast.success('Todo created');
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      toast.success(todo.completed ? 'Marked active' : 'Completed');
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (todo) => {
    if (!window.confirm(`Delete “${todo.title}”?`)) return;
    try {
      await deleteTodo(todo.id);
      toast.success('Todo deleted');
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Track progress, deadlines, and priorities at a glance.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-5 w-5" />
          New todo
        </Button>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Completed" value={stats.completed} hint="Nice momentum" className="border-emerald-200/60 dark:border-emerald-900/50" />
          <StatCard label="Active" value={stats.pending} />
          <StatCard label="Overdue" value={stats.overdue} hint="Needs attention" className="border-rose-200/60 dark:border-rose-900/50" />
        </div>
      )}

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-brand-500/20 transition focus:border-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
            </div>
            <Select
              aria-label="Filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="min-w-[160px]"
            >
              {FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
            <Select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="min-w-[200px]">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-12 w-12" />
        </div>
      ) : todos.length === 0 ? (
        <EmptyState
          title="No todos here"
          description={
            debouncedSearch
              ? 'Try a different search or clear filters.'
              : 'Create your first task to see it on the board.'
          }
        >
          {!debouncedSearch && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-5 w-5" />
              Create todo
            </Button>
          )}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoCard todo={todo} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={openCreate}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700 lg:hidden"
        aria-label="New todo"
      >
        <Plus className="h-7 w-7" />
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit todo' : 'New todo'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={formErrors.title}
          />
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Input
              label="Due date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
