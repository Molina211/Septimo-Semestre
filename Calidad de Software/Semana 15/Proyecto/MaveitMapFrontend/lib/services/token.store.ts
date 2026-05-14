const ACCESS_STORAGE_KEY = 'mapwebbusiness_access_token';
const LEGACY_STORAGE_KEY = 'maveit_map_token';

let memoryAccessToken: string | null = null;
type TokenListener = () => void;
const listeners = new Set<TokenListener>();

const readStorage = () => {
  if (typeof window === 'undefined') {
    return memoryAccessToken;
  }
  try {
    return (
      window.localStorage.getItem(ACCESS_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY) ??
      memoryAccessToken
    );
  } catch {
    return memoryAccessToken;
  }
};

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      /* ignore listener errors */
    }
  });
};

export function getToken(): string | null {
  return readStorage();
}

export function setToken(token: string | null) {
  memoryAccessToken = token;
  if (typeof window === 'undefined') {
    notifyListeners();
    return;
  }
  try {
    if (token === null) {
      window.localStorage.removeItem(ACCESS_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else {
      window.localStorage.setItem(ACCESS_STORAGE_KEY, token);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    /* ignore */
  } finally {
    notifyListeners();
  }
}

export function clearToken() {
  setToken(null);
}

export function clearTokens() {
  // Refresh token is stored as HttpOnly cookie (not accessible from JS).
  // We still clear any legacy localStorage keys if they exist.
  clearToken();
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('mapwebbusiness_refresh_token');
    } catch {
      /* ignore */
    }
  }
}

export function subscribeTokenChange(listener: TokenListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
