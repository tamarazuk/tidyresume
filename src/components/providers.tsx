"use client"

import { ThemeProvider } from "next-themes"
import * as React from "react"

export function Providers({ children, ...props }: React.ComponentProps<typeof ThemeProvider>) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>
            {children}
        </ThemeProvider>
    )
}
