import { api } from '@/lib/api'
import type { SignupFormData, LoginFormData, changePasswordFormData } from '@/schemas/auth/auth.schema'
import { type SignupResponse, type LoginResponse, User } from '@/types/auth'

export const authService = {
    signup(data: SignupFormData) {

        const payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
            password_confirm: data.confirmPassword,
        }

        return api.post<SignupResponse>("/auth/signup/", payload);
    },

    login(data: LoginFormData) {
        return api.post<LoginResponse>("/auth/login/", data);
    },

    me() {
        return api.get<User>("/auth/me/");
    },

    logout() {
        return api.post("/auth/logout/");
    },

    forgotPassword(email: string) {
        return api.post("/auth/forgot-password/", { email });
    },

    resetPassword(data: {
        uid: string;
        token: string;
        password: string;
        confirm_password: string;
    }) {
        return api.post("/auth/reset-password/", data);
    },

    changePassword(data: changePasswordFormData) {

        const payload = {
            current_password: data.currentPassword,
            password: data.password,
            confirm_password: data.confirmPassword,
        }

        return api.post("/auth/change-password/", payload)
    }
}