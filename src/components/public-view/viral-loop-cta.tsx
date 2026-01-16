'use client'

import { MagicWandIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { useOwnerCheck } from '@/hooks/use-owner-check'
import { useState, useEffect } from 'react'
import ButtonLink from '@/components/ui/button-link'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

interface ViralLoopCTAProps {
  resumeId: string
}

export function ViralLoopCTA({ resumeId }: ViralLoopCTAProps) {
  const isOwner = useOwnerCheck(resumeId)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOwner) return

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [isOwner])

  if (isOwner) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out print:hidden",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={(triggerProps) => (
            <ButtonLink
              {...triggerProps}
              href="/edit"
              target="_blank"
              className={cn(
                'bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-lg transition-all hover:scale-105 active:scale-95'
              )}
            >
              <MagicWandIcon className="h-5 w-5" weight="bold" />
              <span>Tidy up your resume</span>
            </ButtonLink>
          )}
        />
        <TooltipContent side="left" sideOffset={16}>
          It's free and takes minutes
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
