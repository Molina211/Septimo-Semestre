import { notFound } from 'next/navigation';
import InvitationPreviewPanel from '@/components/invitations/invitation-preview';
import type { InvitationPreview } from '@/lib/models/invitation-preview.model';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';

async function fetchPreview(token: string): Promise<InvitationPreview> {
  const response = await fetch(`${API_BASE}/api/auth/invitations/${token}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    notFound();
  }
  return response.json();
}

export default async function InvitationPreviewPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { autoAccept?: string };
}) {
  const preview = await fetchPreview(params.token);
  const autoAccept = searchParams?.autoAccept === '1';
  return (
    <div className="min-h-screen bg-slate-950 text-foreground">
      <InvitationPreviewPanel token={params.token} preview={preview} autoAccept={autoAccept} />
    </div>
  );
}
