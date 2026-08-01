import { api } from '@/lib/api'
import type { SignupFormData, LoginFormData } from '@/schemas/auth/auth.schema'
import type { SignupResponse, LoginResponse } from '@/types/auth'

export const authService = {
    signup(data: SignupFormData) {

        const payload = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
            password_confirm: data.confirmPassword,
        }

        return api.post<SignupResponse>("/auth/signup/", payload)
    },

    login(data: LoginFormData){
        return api.post<LoginResponse>("/auth/login/", data)
    }

}