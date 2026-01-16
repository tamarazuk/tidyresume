'use client'

import { EyeIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function OwnerViewBadge() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <Badge
            {...props}
            variant="secondary"
            role="status"
            className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium"
          >
            <EyeIcon size={14} weight="bold" />
            <span>Owner View</span>
          </Badge>
        )}
      />
      <TooltipContent side="bottom" align="center">
        <p className="max-w-xs text-xs leading-normal">
          Only you can see these editing controls. Visitors see a clean version
          of your resume.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
