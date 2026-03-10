export interface RegistrationSession {
  email: string
  expiresAt: string
  attemptsLeft: number
}

const STORAGE_KEY = 'maveit_registration_session'
let memorySession: RegistrationSession | null = null

const readStorage = (): RegistrationSession | null => {
  if (typeof window === 'undefined') {
    return memorySession
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as RegistrationSession
      memorySession = parsed
      return parsed
    }
  } catch {
    // ignore
  }
  return memorySession
}

const persistSession = (session: RegistrationSession | null) => {
  memorySession = session
  if (typeof window === 'undefined') {
    return
  }
  try {
    if (session) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

export function getRegistrationSession(): RegistrationSession | null {
  return readStorage()
}

export function setRegistrationSession(session: RegistrationSession) {
  persistSession(session)
}

export function clearRegistrationSession() {
  persistSession(null)
}

export function updateRegistrationAttempts(attemptsLeft: number): RegistrationSession | null {
  const current = getRegistrationSession()
  if (!current) return null
  const updated = { ...current, attemptsLeft }
  persistSession(updated)
  return updated
}

export function updateRegistrationExpiration(expiresAt: string): RegistrationSession | null {
  const current = getRegistrationSession()
  if (!current) return null
  const updated = { ...current, expiresAt }
  persistSession(updated)
  return updated
}
