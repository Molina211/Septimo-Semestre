import { apiFetch } from './api.client';
import type { InvitationPreview } from '@/lib/models/invitation-preview.model';

const INVITATIONS_BASE = '/api/auth/invitations';

export async function fetchInvitationPreview(token: string): Promise<InvitationPreview> {
  return apiFetch<InvitationPreview>(`${INVITATIONS_BASE}/${token}`, {
    method: 'GET',
    requireAuth: false,
  });
}

export async function acceptInvitation(token: string): Promise<void> {
  await apiFetch<void>(`${INVITATIONS_BASE}/${token}/accept`, {
    method: 'POST',
  });
}

export async function inviteUser(email: string): Promise<void> {
  await apiFetch<void>(INVITATIONS_BASE, {
    method: 'POST',
    body: { inviteeEmail: email.trim() },
  });
}
