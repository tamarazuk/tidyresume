import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

interface AppIconProps extends ComponentProps<'svg'> {
  title?: string
  /**
   * 'default' for header/UI use
   * 'favicon' for more rounded corners in small contexts
   */
  variant?: 'default' | 'favicon'
}

export default function AppIcon({
  className,
  fill = '#6366F1',
  title = 'Tidy Resume',
  variant = 'default',
  ...props
}: AppIconProps) {
  // Use slightly different paths based on variant for optical sizing
  const d =
    variant === 'favicon'
      ? 'M0 28A28 28 0 0 1 28 0h44a28 28 0 0 1 28 28v2H0zM0 36h40a6 6 0 0 1 6 6v58H28A28 28 0 0 1 0 72zM54 42a6 6 0 0 1 6-6h40v36a28 28 0 0 1-28 28H54z'
      : 'M0 12A12 12 0 0 1 12 0h76a12 12 0 0 1 12 12v18H0zM0 36h40a6 6 0 0 1 6 6v58H12a12 12 0 0 1-12-12zM54 42a6 6 0 0 1 6-6h40v52a12 12 0 0 1-12 12H54z'

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-5 w-5', className)}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path fill={fill} d={d} />
    </svg>
  )
}
