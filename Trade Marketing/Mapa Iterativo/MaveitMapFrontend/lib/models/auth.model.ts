export interface AuthResponse {
  token: string;
}

export interface RegistrationSessionResponse {
  email: string;
  expiresAt: string;
  attemptsLeft: number;
}
