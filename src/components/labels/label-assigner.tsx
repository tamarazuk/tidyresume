'use client'

import { cloneElement, isValidElement, useState } from 'react'
import { CheckIcon, PlusIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useResumeStore, type ResumeDraftId } from '@/stores/resume-store'
import type { ResumeLabelId } from '@/types/resume'
import { LabelForm } from './label-form'

interface LabelAssignerProps {
  draftId: ResumeDraftId
  children: React.ReactNode
  onManageLabels?: () => void
}

export function LabelAssigner({
  draftId,
  children,
  onManageLabels,
}: LabelAssignerProps) {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const labelsById = useResumeStore((s) => s.labelsById)
  const labelOrder = useResumeStore((s) => s.labelOrder)
  const draftsById = useResumeStore((s) => s.draftsById)
  const addLabelToDraft = useResumeStore((s) => s.addLabelToDraft)
  const removeLabelFromDraft = useResumeStore((s) => s.removeLabelFromDraft)
  const createLabel = useResumeStore((s) => s.createLabel)

  const draft = draftsById[draftId]
  const assignedIds = new Set(draft?.labelIds ?? [])
  const labels = labelOrder.map((id) => labelsById[id]).filter(Boolean)

  const toggle = (labelId: ResumeLabelId) => {
    if (assignedIds.has(labelId)) {
      removeLabelFromDraft(draftId, labelId)
    } else {
      addLabelToDraft(draftId, labelId)
    }
  }

  const handleCreate = (name: string, color: string) => {
    const newLabelId = createLabel(name, color)
    addLabelToDraft(draftId, newLabelId)
    setIsCreating(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setIsCreating(false)
      }}
    >
      <PopoverTrigger
        render={(props) => {
          if (isValidElement(children)) {
            return cloneElement(children, props as Record<string, unknown>)
          }
          return <span {...props}>{children}</span>
        }}
      />
      <PopoverContent className="w-72 p-0" align="start">
        <div className="border-border flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium">Assign labels</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsCreating(!isCreating)}
            aria-label={isCreating ? 'Cancel creation' : 'Create new label'}
            className={cn(isCreating && 'bg-muted text-foreground')}
          >
            <PlusIcon size={14} weight="bold" />
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {isCreating ? (
            <div className="p-3">
              <LabelForm
                onSave={handleCreate}
                onCancel={() => setIsCreating(false)}
              />
            </div>
          ) : (
            <>
              {labels.length === 0 ? (
                <div className="text-muted-foreground px-3 py-4 text-center text-xs">
                  No labels created yet.
                </div>
              ) : (
                labels.map((label) => {
                  const isAssigned = assignedIds.has(label.id)
                  return (
                    <button
                      key={label.id}
                      type="button"
                      className="hover:bg-muted/40 flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors"
                      onClick={() => toggle(label.id)}
                      aria-label={`${isAssigned ? 'Remove' : 'Add'} label ${label.name}`}
                    >
                      <span
                        className={cn(
                          'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
                          isAssigned
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border'
                        )}
                      >
                        {isAssigned ? (
                          <CheckIcon size={10} weight="bold" />
                        ) : null}
                      </span>
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {label.name}
                      </span>
                    </button>
                  )
                })
              )}
            </>
          )}
        </div>

        {onManageLabels && !isCreating ? (
          <div className="border-border border-t px-3 py-2">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-muted-foreground w-full"
              onClick={onManageLabels}
            >
              Manage labels
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
