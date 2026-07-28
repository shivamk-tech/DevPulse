export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
}

export interface SignupResponse {
  message: string;
  user: User;
}

