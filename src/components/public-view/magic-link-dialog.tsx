'use client'

import type React from 'react'
import { useState } from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { EnvelopeSimpleIcon, PaperPlaneRightIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type TriggerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>
}

interface MagicLinkDialogProps {
  resumeId: string
  triggerProps?: TriggerButtonProps
  triggerVariant?: React.ComponentProps<typeof Button>['variant']
}

export function MagicLinkDialog({
  resumeId,
  triggerProps,
  triggerVariant = 'ghost',
}: MagicLinkDialogProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeId, email }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send link')
      }

      toast.success('Magic link sent!', {
        description: 'Check your email for the edit link.',
      })
      setIsOpen(false)
      setEmail('')
    } catch (error) {
      toast.error('Error sending link', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={(dialogTriggerProps) => {
          const tooltipTriggerProps = (triggerProps ?? {}) as TriggerButtonProps
          const {
            ref: tooltipRef,
            className: tooltipClassName,
            ...tooltipRest
          } = tooltipTriggerProps

          const dialogTriggerButtonProps =
            dialogTriggerProps as TriggerButtonProps
          const {
            ref: dialogRef,
            className: dialogClassName,
            ...dialogRest
          } = dialogTriggerButtonProps

          const mergedTriggerProps = mergeProps<'button'>(
            dialogRest,
            tooltipRest,
            {
              className: cn(dialogClassName, tooltipClassName),
            }
          ) as TriggerButtonProps

          const assignRef = (node: HTMLButtonElement | null) => {
            if (typeof dialogRef === 'function') {
              dialogRef(node)
            } else if (dialogRef) {
              ;(
                dialogRef as React.MutableRefObject<HTMLButtonElement | null>
              ).current = node
            }

            if (typeof tooltipRef === 'function') {
              tooltipRef(node)
            } else if (tooltipRef) {
              ;(
                tooltipRef as React.MutableRefObject<HTMLButtonElement | null>
              ).current = node
            }
          }

          const {
            className: mergedTriggerClassName,
            ...forwardedTriggerProps
          } = mergedTriggerProps

          return (
            <Button
              {...forwardedTriggerProps}
              ref={assignRef}
              variant={triggerVariant}
              size="sm"
              className={cn('gap-1.5', mergedTriggerClassName)}
              aria-label="Edit on another device"
            >
              <EnvelopeSimpleIcon size={16} />
              <span className="sm:hidden">Edit elsewhere</span>
            </Button>
          )
        }}
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit on another device</DialogTitle>
          <DialogDescription>
            Send a magic link to your email to edit this resume on any device.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? 'Sending...' : 'Send Link'}
              {!isLoading && <PaperPlaneRightIcon size={16} />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
