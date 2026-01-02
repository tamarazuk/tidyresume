'use client'

import type { ReactElement, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ToolbarTooltipProps {
  label: string
  children: ReactElement
  tooltip?: ReactNode
  className?: string
}

export default function ToolbarTooltip({
  label,
  children,
  tooltip,
  className,
}: ToolbarTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => {
          const { className: triggerClassName, ...rest } = props
          return (
            <span
              {...rest}
              className={cn('inline-flex', triggerClassName, className)}
            >
              {children}
            </span>
          )
        }}
      />
      <TooltipContent>{tooltip ?? label}</TooltipContent>
    </Tooltip>
  )
}
