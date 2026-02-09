'use client'

import { ThemeProvider } from 'next-themes'
import * as React from 'react'
import { NavigationLoadingProvider } from '@/providers/navigation-loading-provider'
import NavigationLoadingOverlay from '@/components/ui/navigation-loading-overlay'

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <NavigationLoadingProvider>
        {children}
        <NavigationLoadingOverlay />
      </NavigationLoadingProvider>
    </ThemeProvider>
  )
}
