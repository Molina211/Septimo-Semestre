import { clearTokens, getToken, setToken } from './token.store'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'

export class ApiError extends Error {
  readonly status: number | null
  readonly details: unknown

  constructor(message: string, status: number | null = null, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

type ApiOptions = RequestInit & { requireAuth?: boolean }

let refreshInFlight: Promise<string | null> | null = null

function redirectToLogin() {
  if (typeof window === 'undefined') return
  const current = `${window.location.pathname}${window.location.search}`
  if (window.location.pathname.startsWith('/login')) return
  window.location.href = `/login?redirect=${encodeURIComponent(current)}`
}

function buildUrl(path: string) {
  if (path.startsWith('http')) {
    return path
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${normalized}`
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const url = buildUrl('/api/auth/refresh')
      let response: Response
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
      } catch {
        // Backend unreachable; keep current tokens and let the original request surface the error.
        return null
      }

      const text = await response.text()
      let parsed: any = null
      if (text) {
        try {
          parsed = JSON.parse(text)
        } catch {
          parsed = text
        }
      }

      if (!response.ok) {
        clearTokens()
        return null
      }

      const accessToken: string | undefined = parsed?.accessToken ?? parsed?.token
      if (!accessToken) {
        clearTokens()
        return null
      }

      setToken(accessToken)
      return accessToken
    })().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

async function parseResponseBody(response: Response) {
  const text = await response.text()
  if (!text) {
    return { text: '', parsed: null as unknown }
  }
  try {
    return { text, parsed: JSON.parse(text) as unknown }
  } catch {
    return { text, parsed: text as unknown }
  }
}

function extractErrorMessage(parsedBody: unknown, fallback: string) {
  if (typeof parsedBody === 'object' && parsedBody !== null && 'message' in (parsedBody as any)) {
    return (parsedBody as any).message as string
  }
  if (typeof parsedBody === 'string') {
    return parsedBody
  }
  return fallback
}

export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { requireAuth = true, body: providedBody, headers: providedHeaders, ...restOptions } = options
  const url = buildUrl(path)
  const initialToken = getToken()

  if (requireAuth && !initialToken) {
    redirectToLogin()
    throw new ApiError('Token requerido', 401)
  }

  let body: BodyInit | null = providedBody ?? null
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  const doRequest = async (accessTokenOverride?: string | null) => {
    const headers = new Headers(providedHeaders ?? {})
    const accessToken = accessTokenOverride ?? getToken()
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    try {
      return await fetch(url, { ...restOptions, headers, body, credentials: 'include' })
    } catch (e) {
      throw new ApiError('No se pudo conectar con el servidor', null, e)
    }
  }

  let response = await doRequest(initialToken)
  let { text, parsed } = await parseResponseBody(response)

  if (!response.ok && response.status === 401 && requireAuth) {
    const newAccessToken = await refreshAccessToken()
    if (newAccessToken) {
      response = await doRequest(newAccessToken)
      ;({ text, parsed } = await parseResponseBody(response))
    }
  }

  if (!response.ok) {
    if (requireAuth && (response.status === 401 || response.status === 403)) {
      // Any auth failure on a protected request should send the user back to login.
      clearTokens()
      redirectToLogin()
    }
    const fallback = response.statusText || 'Error en la peticion'
    const message = extractErrorMessage(parsed, fallback)
    throw new ApiError(message ?? fallback, response.status, parsed)
  }

  if (response.status === 204 || !text) {
    return undefined as unknown as T
  }

  return parsed as T
}
