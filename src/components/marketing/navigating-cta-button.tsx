'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import type { MouseEvent, ReactNode } from 'react'
import { useNavigationLoading } from '@/providers/navigation-loading-provider'
import { cn } from '@/lib/utils'

interface NavigatingCtaButtonProps {
  href: string
  children: ReactNode
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
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isPlainLeftClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey

    if (!isPlainLeftClick) return

    event.preventDefault()
    navigateTo(href)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn('cursor-pointer', className)}
    >
      {children}
      {icon && <ArrowRightIcon size={18} aria-hidden />}
    </Link>
  )
}
