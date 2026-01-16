'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'

type LinkProps = ComponentProps<typeof Link>

interface ButtonLinkProps extends Omit<
  ComponentProps<typeof Button>,
  'render' | 'nativeButton'
> {
  href: string
  target?: LinkProps['target']
  rel?: LinkProps['rel']
}

export default function ButtonLink({
  href,
  target,
  rel,
  ...props
}: ButtonLinkProps) {
  const resolvedRel =
    rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

  return (
    <Button
      render={(buttonProps) => (
        <Link {...buttonProps} href={href} target={target} rel={resolvedRel} />
      )}
      nativeButton={false}
      {...props}
    />
  )
}
