'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'
import { useNavigationLoading } from '@/providers/navigation-loading-provider'
import { cn } from '@/lib/utils'

interface NavigatingCtaButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  icon?: boolean
}

export default function NavigatingCtaButton({
  href,
  children,
  className,
  icon = true,
}: NavigatingCtaButtonProps) {
  const { navigateTo } = useNavigationLoading()

  return (
    <button
      type="button"
      onClick={() => navigateTo(href)}
      className={cn('cursor-pointer', className)}
    >
      {children}
      {icon && <ArrowRightIcon size={18} aria-hidden />}
    </button>
  )
}
