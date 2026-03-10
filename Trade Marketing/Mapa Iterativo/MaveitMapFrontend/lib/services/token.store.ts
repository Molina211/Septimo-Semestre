const STORAGE_KEY = 'maveit_map_token';
let memoryToken: string | null = null;
type TokenListener = () => void;
const listeners = new Set<TokenListener>();

const readStorage = () => {
  if (typeof window === 'undefined') {
    return memoryToken;
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memoryToken;
  } catch {
    return memoryToken;
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
  memoryToken = token;
  if (typeof window === 'undefined') {
    notifyListeners();
    return;
  }
  try {
    if (token === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, token);
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

export function subscribeTokenChange(listener: TokenListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
