import { redirect } from 'next/navigation'

export default function AcceptInvitationRedirect({ params }: { params: { token: string } }) {
  redirect(`/invitations/${params.token}`)
}

