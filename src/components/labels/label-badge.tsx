'use client'

import { cn } from '@/lib/utils'

interface LabelBadgeProps {
  name: string
  color: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function LabelBadge({
  name,
  color,
  selected,
  onClick,
  className,
}: LabelBadgeProps) {
  const Component = onClick ? 'button' : 'span'
  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
        selected
          ? 'ring-primary/40 ring-offset-background ring-2 ring-offset-1'
          : '',
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      style={{
        backgroundColor: color + '20',
        color: color,
      }}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
    </Component>
  )
}

export function LabelDot({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      className={cn('size-2 shrink-0 rounded-full', className)}
      style={{ backgroundColor: color }}
    />
  )
}
