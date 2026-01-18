'use client'

import { useState, type ComponentProps } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CloudSlashIcon, SpinnerGapIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useOwnerCheck } from '@/hooks/use-owner-check'
import { deleteResume } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

interface UnpublishButtonProps {
  id: string
  buttonProps?: ComponentProps<typeof Button>
  label?: string
  showLabel?: boolean
  labelClassName?: string
  showTooltip?: boolean
}

export function UnpublishButton({
  id,
  buttonProps,
  label = 'Unpublish',
  showLabel = false,
  labelClassName = 'hidden sm:inline',
  showTooltip = true,
}: UnpublishButtonProps) {
  const isOwner = useOwnerCheck(id)
  const router = useRouter()
  const unpublish = useResumeStore((state) => state.unpublish)
  const editSecret = useResumeStore((state) => state.editSecret)
  const [isUnpublishing, setIsUnpublishing] = useState(false)

  if (!isOwner) return null

  const handleUnpublish = async () => {
    if (
      !confirm('Are you sure? Your public link will stop working immediately.')
    )
      return

    setIsUnpublishing(true)
    try {
      await deleteResume(id, { editSecret })
      unpublish()
      toast.success('Resume unpublished successfully')
      router.push('/edit')
    } catch (error) {
      console.error(error)
      toast.error('Failed to unpublish resume')
      setIsUnpublishing(false)
    }
  }

  return (
    <>
      {isUnpublishing && (
        <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="border-border bg-background flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg">
            <SpinnerGapIcon className="animate-spin" size={20} />
            <span className="text-sm font-medium">Unpublishing...</span>
          </div>
        </div>
      )}
      {showTooltip ? (
        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <Button
                {...props}
                {...buttonProps}
                variant={buttonProps?.variant ?? 'ghost'}
                size={buttonProps?.size ?? 'icon'}
                className={cn(
                  'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                  props.className,
                  buttonProps?.className
                )}
                onClick={(event) => {
                  props.onClick?.(event)
                  buttonProps?.onClick?.(event)
                  handleUnpublish()
                }}
                disabled={isUnpublishing}
                aria-label={buttonProps?.['aria-label'] ?? `${label} resume`}
              >
                {isUnpublishing ? (
                  <SpinnerGapIcon size={16} className="animate-spin" />
                ) : (
                  <CloudSlashIcon size={16} />
                )}
                {showLabel ? (
                  <span className={labelClassName}>{label}</span>
                ) : null}
              </Button>
            )}
          />
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ) : (
        <Button
          {...buttonProps}
          variant={buttonProps?.variant ?? 'ghost'}
          size={buttonProps?.size ?? 'icon'}
          className={cn(
            'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
            buttonProps?.className
          )}
          onClick={(event) => {
            buttonProps?.onClick?.(event)
            handleUnpublish()
          }}
          disabled={isUnpublishing}
          aria-label={buttonProps?.['aria-label'] ?? `${label} resume`}
        >
          {isUnpublishing ? (
            <SpinnerGapIcon size={16} className="animate-spin" />
          ) : (
            <CloudSlashIcon size={16} />
          )}
          {showLabel ? <span className={labelClassName}>{label}</span> : null}
        </Button>
      )}
    </>
  )
}
