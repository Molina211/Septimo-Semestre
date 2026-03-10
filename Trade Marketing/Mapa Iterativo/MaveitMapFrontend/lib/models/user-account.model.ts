export type UserRoleType = 'ADMIN' | 'SUPER_ADMIN' | 'VIEWER';

export interface AccountReference {
  id: number;
  name: string;
  email: string;
  companyName: string;
}

export interface UserAccountResponse {
  id: number;
  name: string;
  companyName: string;
  email: string;
  role: UserRoleType;
  viewers: AccountReference[];
  owner?: AccountReference | null;
  sessionActive: boolean;
  createdAt: string;
}
