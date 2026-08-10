"use client"

import { createContext } from "react"
import { User } from "@/types/auth"

import React from 'react'

export interface AuthContextType {
    user: User | null

    loading: boolean;

    isAuthenticated: boolean;

    refreshUser: () => Promise<void>;

    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

