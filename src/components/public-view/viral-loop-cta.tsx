'use client'

import { MagicWandIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import { useOwnerCheck } from '@/hooks/use-owner-check'

interface ViralLoopCTAProps {
  resumeId: string
}

export function ViralLoopCTA({ resumeId }: ViralLoopCTAProps) {
  const isOwner = useOwnerCheck(resumeId)

  if (isOwner) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <button
        className={cn(
          "bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-6 py-3 font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        )}
      >
        <MagicWandIcon className="h-5 w-5" weight="bold" />
        <span>Tidy up your resume</span>
      </button>
    </div>
  )
}
