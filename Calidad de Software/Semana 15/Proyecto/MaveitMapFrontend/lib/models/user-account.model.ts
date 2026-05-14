export type UserRoleType = 'ADMIN' | 'SUPER_ADMIN';

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
  sessionActive: boolean;
  enabled: boolean;
  createdAt: string;
}
