import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

/** Wait for zustand persist to rehydrate from localStorage before auth checks. */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return hydrated;
}
