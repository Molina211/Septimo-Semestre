export interface AuthResponse {
  // Backward compatible (backend still emits "token" = accessToken)
  token?: string;
  accessToken: string;
  refreshToken?: string;
}

export interface RegistrationSessionResponse {
  email: string;
  expiresAt: string;
  attemptsLeft: number;
}
