import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light' | 'dark' | 'system'
      setTheme: (theme) => set({ theme }),
      /** Apply class on document from current theme preference. */
      applyDocumentTheme: () => {
        const root = document.documentElement;
        const { theme } = get();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const dark = theme === 'dark' || (theme === 'system' && prefersDark);
        root.classList.toggle('dark', dark);
      },
    }),
    { name: 'taskflow-theme' }
  )
);
