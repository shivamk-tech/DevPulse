"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/contexts/auth-context";
import { authService } from "@/services/auth/auth.service";
import type { User } from "@/types/auth";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {

        const response = await authService.me()

    }, []);

    const logout = useCallback(async () => {

    }, []);

    useEffect(() => {

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}