'use client'

import { cloneElement, isValidElement, useState } from 'react'
import { PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useResumeStore } from '@/stores/resume-store'
import type { ResumeLabelId } from '@/types/resume'
import { LabelForm } from './label-form'

type EditingState =
  | { mode: 'idle' }
  | { mode: 'create' }
  | { mode: 'edit'; labelId: ResumeLabelId }

export function LabelManager({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<EditingState>({ mode: 'idle' })

  const labelsById = useResumeStore((s) => s.labelsById)
  const labelOrder = useResumeStore((s) => s.labelOrder)
  const createLabel = useResumeStore((s) => s.createLabel)
  const updateLabel = useResumeStore((s) => s.updateLabel)
  const deleteLabel = useResumeStore((s) => s.deleteLabel)

  const labels = labelOrder.map((id) => labelsById[id]).filter(Boolean)

  const handleCreate = (name: string, color: string) => {
    createLabel(name, color)
    setEditing({ mode: 'idle' })
  }

  const handleUpdate = (id: ResumeLabelId, name: string, color: string) => {
    updateLabel(id, { name, color })
    setEditing({ mode: 'idle' })
  }

  const handleDelete = (id: ResumeLabelId) => {
    if (!confirm('Delete this label? It will be removed from all resumes.')) {
      return
    }
    deleteLabel(id)
    if (editing.mode === 'edit' && editing.labelId === id) {
      setEditing({ mode: 'idle' })
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) setEditing({ mode: 'idle' })
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
          <span className="text-sm font-medium">Labels</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() =>
              setEditing(
                editing.mode === 'create'
                  ? { mode: 'idle' }
                  : { mode: 'create' }
              )
            }
            aria-label="New label"
          >
            <PlusIcon size={14} weight="bold" />
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {editing.mode === 'create' ? (
            <div className="border-border border-b p-3">
              <LabelForm
                onSave={handleCreate}
                onCancel={() => setEditing({ mode: 'idle' })}
              />
            </div>
          ) : null}

          {labels.length === 0 && editing.mode !== 'create' ? (
            <div className="text-muted-foreground px-3 py-6 text-center text-xs">
              No labels yet. Create one to get started.
            </div>
          ) : null}

          {labels.map((label) => {
            if (editing.mode === 'edit' && editing.labelId === label.id) {
              return (
                <div key={label.id} className="border-border border-b p-3">
                  <LabelForm
                    initialName={label.name}
                    initialColor={label.color}
                    onSave={(name, color) =>
                      handleUpdate(label.id, name, color)
                    }
                    onCancel={() => setEditing({ mode: 'idle' })}
                  />
                </div>
              )
            }
            return (
              <div
                key={label.id}
                className="hover:bg-muted/40 flex items-center gap-2 px-3 py-2 transition-colors"
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {label.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    setEditing({ mode: 'edit', labelId: label.id })
                  }
                  aria-label={`Edit ${label.name}`}
                >
                  <PencilSimpleIcon size={12} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(label.id)}
                  aria-label={`Delete ${label.name}`}
                >
                  <TrashIcon size={12} />
                </Button>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
