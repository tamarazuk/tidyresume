'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'

interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Button>, 'render' | 'nativeButton'> {
  href: string
}

export default function ButtonLink({ href, ...props }: ButtonLinkProps) {
  return (
    <Button
      render={(buttonProps) => <Link href={href} {...buttonProps} />}
      nativeButton={false}
      {...props}
    />
  )
}
