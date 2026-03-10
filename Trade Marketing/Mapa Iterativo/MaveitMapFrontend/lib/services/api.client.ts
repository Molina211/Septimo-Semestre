import { getToken } from './token.store'

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

function buildUrl(path: string) {
  if (path.startsWith('http')) {
    return path
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${normalized}`
}

export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { requireAuth = true, body: providedBody, headers: providedHeaders, ...restOptions } = options
  const url = buildUrl(path)
  const headers = new Headers(providedHeaders ?? {})
  const token = getToken()

  if (requireAuth && !token) {
    throw new ApiError('Token requerido', 401)
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let body: BodyInit | null = providedBody ?? null
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, { ...restOptions, headers, body })
  const text = await response.text()
  let parsedBody: unknown = null

  if (text) {
    try {
      parsedBody = JSON.parse(text)
    } catch (error) {
      parsedBody = text
    }
  }

  if (!response.ok) {
    const fallback = response.statusText || 'Error en la petición'
    const message =
      typeof parsedBody === 'object' && parsedBody !== null && 'message' in parsedBody
        ? (parsedBody as Record<string, unknown>).message as string
        : typeof parsedBody === 'string'
          ? parsedBody
          : fallback
    throw new ApiError(message ?? fallback, response.status, parsedBody)
  }

  if (response.status === 204 || !text) {
    return undefined as unknown as T
  }

  return parsedBody as T
}
