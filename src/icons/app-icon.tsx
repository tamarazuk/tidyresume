import { cn } from '@/lib/utils'

interface AppIconProps {
  className?: string
}

export default function AppIcon({ className }: AppIconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden
      className={cn('h-5 w-5', className)}
      role="img"
    >
      <rect width="512" height="512" rx="120" fill="#6366F1" />
      <path d="M162 166H350V214H278V348H230V214H162V166Z" fill="#ffffff" />
    </svg>
  )
}
