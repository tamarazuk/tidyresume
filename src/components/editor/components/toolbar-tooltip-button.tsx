'use client'

import type { MouseEvent, ReactElement, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ToolbarTooltipButtonProps {
  label: string
  icon: ReactElement
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  tooltip?: ReactNode
  className?: string
}

const TOOLBAR_BASE_CLASS = 'md-editor-toolbar-item'
const TOOLBAR_DISABLED_CLASS = 'md-editor-disabled'

export default function ToolbarTooltipButton({
  label,
  icon,
  onClick,
  disabled,
  tooltip,
  className,
}: ToolbarTooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        aria-label={label}
        className={cn(
          TOOLBAR_BASE_CLASS,
          disabled && TOOLBAR_DISABLED_CLASS,
          className
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{tooltip ?? label}</TooltipContent>
    </Tooltip>
  )
}
