import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';
import { useThemeStore } from './store/themeStore';

useThemeStore.subscribe(() => {
  useThemeStore.getState().applyDocumentTheme();
});

if (useThemeStore.persist.hasHydrated()) {
  useThemeStore.getState().applyDocumentTheme();
} else {
  useThemeStore.persist.onFinishHydration(() => {
    useThemeStore.getState().applyDocumentTheme();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          className: '!bg-slate-900 !text-white dark:!bg-white dark:!text-slate-900',
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
