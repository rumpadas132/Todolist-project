import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-600/40 via-slate-950 to-slate-950" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5 text-brand-200" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Taskflow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-12 lg:flex-row lg:items-center lg:pt-20">
        <section className="flex-1 space-y-8 animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-100 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Full-stack productivity
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your calm,{' '}
            <span className="bg-gradient-to-r from-brand-200 to-indigo-200 bg-clip-text text-transparent">
              modern
            </span>{' '}
            todo command center.
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Plan priorities, due dates, and progress with a polished dashboard. Built with React, Express, and MongoDB —
            ready for real daily use.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-400"
            >
              Create free account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              I have an account
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {['JWT-secured accounts', 'Priority & due dates', 'Search, filter, sort', 'Dark / light themes'].map(
              (t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  {t}
                </li>
              )
            )}
          </ul>
        </section>

        <section className="flex-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-200">Today</p>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                72% done
              </span>
            </div>
            <div className="space-y-3">
              {[
                { t: 'Ship landing page', d: 'High priority', done: true },
                { t: 'API validation pass', d: 'Medium', done: true },
                { t: 'Dark mode polish', d: 'Due tomorrow', done: false },
              ].map((row) => (
                <div
                  key={row.t}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      row.done ? 'border-emerald-400 bg-emerald-400/20' : 'border-slate-500'
                    }`}
                  >
                    {row.done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${row.done ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {row.t}
                    </p>
                    <p className="text-xs text-slate-400">{row.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
