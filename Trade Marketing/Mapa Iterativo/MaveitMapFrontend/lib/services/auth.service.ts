import { apiFetch } from './api.client';
import { clearTokens, setToken } from './token.store';
import type { AuthResponse, RegistrationSessionResponse } from '../models/auth.model';

const LOGIN_ENDPOINT = '/api/auth/login';
const REGISTER_ENDPOINT = '/api/auth/register';
const CONFIRM_ENDPOINT = '/api/auth/register/confirm';
const RESEND_ENDPOINT = '/api/auth/resend-code';
const EMAIL_CONFIRM_ENDPOINT = '/api/auth/email/confirm';
const EMAIL_RESEND_ENDPOINT = '/api/auth/email/resend';
const LOGOUT_ENDPOINT = '/api/auth/logout';
const REFRESH_ENDPOINT = '/api/auth/refresh';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  companyName: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'SUPER_ADMIN' | 'VIEWER';
}

export interface ConfirmationPayload {
  email: string;
  code: string;
}

export interface ResendPayload {
  email: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>(LOGIN_ENDPOINT, {
    method: 'POST',
    body: payload,
    requireAuth: false,
  });
  const accessToken = response.accessToken ?? response.token;
  setToken(accessToken);
  return response;
}

export async function register(
  payload: RegisterPayload,
  initialSuperAdminSecret?: string
): Promise<RegistrationSessionResponse> {
  const headers = initialSuperAdminSecret
    ? { 'X-Initial-Super-Admin': initialSuperAdminSecret }
    : undefined;
  return apiFetch<RegistrationSessionResponse>(REGISTER_ENDPOINT, {
    method: 'POST',
    headers,
    body: payload,
    requireAuth: false,
  });
}

export async function confirmRegistration(payload: ConfirmationPayload): Promise<void> {
  await apiFetch<void>(CONFIRM_ENDPOINT, {
    method: 'POST',
    body: payload,
    requireAuth: false,
  });
}

export async function resendCode(payload: ResendPayload): Promise<void> {
  await apiFetch<void>(RESEND_ENDPOINT, {
    method: 'POST',
    body: payload,
    requireAuth: false,
  });
}

export async function confirmEmailVerification(payload: ConfirmationPayload): Promise<void> {
  await apiFetch<void>(EMAIL_CONFIRM_ENDPOINT, {
    method: 'POST',
    body: payload,
    requireAuth: false,
  });
}

export async function resendEmailVerification(payload: ResendPayload): Promise<void> {
  await apiFetch<void>(EMAIL_RESEND_ENDPOINT, {
    method: 'POST',
    body: payload,
    requireAuth: false,
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>(LOGOUT_ENDPOINT, {
      method: 'POST',
    });
  } finally {
    clearTokens();
  }
}

export async function refresh(): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>(REFRESH_ENDPOINT, {
    method: 'POST',
    requireAuth: false,
  });
  const accessToken = response.accessToken ?? response.token;
  setToken(accessToken);
  return response;
}
