'use client'

import React from 'react'
import {ThemeProvider as NextThemesProvider} from "next-themes"


type ThemeProviderProps = {
    children: React.ReactNode;
}

export default function ThemeProvider({children}: ThemeProviderProps){
    return (
        <NextThemesProvider
            attribute ="class"
            defaultTheme = "dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}