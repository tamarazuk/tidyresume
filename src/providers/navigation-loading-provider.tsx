'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react'
import { useRouter } from 'next/navigation'

interface NavigationLoadingContextValue {
  isNavigating: boolean
  navigateTo: (href: string) => void
}

const NavigationLoadingContext =
  createContext<NavigationLoadingContextValue | null>(null)

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)
  if (!context) {
    throw new Error(
      'useNavigationLoading must be used within NavigationLoadingProvider'
    )
  }
  return context
}

interface NavigationLoadingProviderProps {
  children: React.ReactNode
}

export function NavigationLoadingProvider({
  children,
}: NavigationLoadingProviderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isNavigating, setIsNavigating] = useState(false)

  const navigateTo = useCallback(
    (href: string) => {
      setIsNavigating(true)
      startTransition(() => {
        router.push(href)
      })
    },
    [router]
  )

  // Reset navigating state when transition completes
  const actuallyNavigating = isNavigating && isPending

  return (
    <NavigationLoadingContext.Provider
      value={{ isNavigating: actuallyNavigating, navigateTo }}
    >
      {children}
    </NavigationLoadingContext.Provider>
  )
}
