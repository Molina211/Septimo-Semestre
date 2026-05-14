import { apiFetch } from './api.client';
import type { UserAccountResponse } from '../models/user-account.model';

const USER_ENDPOINT = '/api/auth/users';

export async function getUserProfile(id: number): Promise<UserAccountResponse> {
  return apiFetch<UserAccountResponse>(`${USER_ENDPOINT}/${id}`);
}

export async function releaseUsers(userIds: number[]): Promise<void> {
  await apiFetch<void>(`${USER_ENDPOINT}/release`, {
    method: 'POST',
    body: { userIds },
  });
}

export async function releaseSelf(): Promise<void> {
  await apiFetch<void>(`${USER_ENDPOINT}/self/release`, {
    method: 'POST',
  });
}
