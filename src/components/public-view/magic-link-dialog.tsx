'use client'

import { useState } from 'react'
import { EnvelopeSimpleIcon, PaperPlaneRightIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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

interface MagicLinkDialogProps {
  resumeId: string
  triggerProps?: React.ComponentPropsWithoutRef<typeof DialogTrigger>
}

export function MagicLinkDialog({ resumeId, triggerProps }: MagicLinkDialogProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger {...triggerProps}>
        <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            aria-label="Edit on another device"
        >
          <EnvelopeSimpleIcon size={16} />
          <span className="sm:hidden">Edit elsewhere</span>
        </Button>
      </DialogTrigger>
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
              onChange={(e) => setEmail(e.target.value)}
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
