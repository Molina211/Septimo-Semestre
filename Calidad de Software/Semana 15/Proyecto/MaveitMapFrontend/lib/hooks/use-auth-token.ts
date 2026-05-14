'use client';

import { useSyncExternalStore } from 'react';
import { getToken, subscribeTokenChange } from '@/lib/services/token.store';

export function useAuthToken() {
  return useSyncExternalStore(subscribeTokenChange, getToken, () => null);
}
