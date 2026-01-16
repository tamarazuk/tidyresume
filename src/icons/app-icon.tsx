import { cn } from '@/lib/utils'

interface AppIconProps {
  className?: string
  fill?: string
  title?: string
}

export default function AppIcon({
  className,
  fill = '#6366F1',
  title = 'Tidy Resume',
}: AppIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-5 w-5', className)}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Top bar: rounded TOP corners only, flush to top */}
      <path
        d="M0 12
           A12 12 0 0 1 12 0
           H88
           A12 12 0 0 1 100 12
           V30
           H0
           Z"
        fill={fill}
      />

      {/* Bottom left: flush to bottom/left */}
      <path
        d="M0 36
           H40
           A6 6 0 0 1 46 42
           V100
           H12
           A12 12 0 0 1 0 88
           Z"
        fill={fill}
      />

      {/* Bottom right: flush to bottom/right */}
      <path
        d="M54 42
           A6 6 0 0 1 60 36
           H100
           V88
           A12 12 0 0 1 88 100
           H54
           Z"
        fill={fill}
      />
    </svg>
  )
}
