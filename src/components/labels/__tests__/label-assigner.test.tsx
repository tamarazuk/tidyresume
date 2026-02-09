import type React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { LabelAssigner } from '../label-assigner'
import { useResumeStore } from '@/stores/resume-store'

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverTrigger: ({
    render,
  }: {
    render: (props: Record<string, unknown>) => React.ReactNode
  }) => <div>{render({})}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

describe('LabelAssigner', () => {
  let draftId: string

  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    // Clear all labels
    const state = useResumeStore.getState()
    for (const id of state.labelOrder) {
      state.deleteLabel(id)
    }
    draftId = useResumeStore.getState().getActiveDraft().draftId
  })

  it('shows empty state when no labels exist', () => {
    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    expect(screen.getByText('No labels created yet.')).toBeInTheDocument()
  })

  it('shows available labels', () => {
    useResumeStore.getState().createLabel('Google', '#3b82f6')
    useResumeStore.getState().createLabel('Frontend', '#22c55e')

    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('assigns a label to the draft when clicked', () => {
    const labelId = useResumeStore.getState().createLabel('Google', '#3b82f6')

    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    fireEvent.click(screen.getByLabelText('Add label Google'))

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).toContain(labelId)
  })

  it('removes an assigned label when clicked again', () => {
    const labelId = useResumeStore.getState().createLabel('Google', '#3b82f6')
    useResumeStore.getState().addLabelToDraft(draftId, labelId)

    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    fireEvent.click(screen.getByLabelText('Remove label Google'))

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).not.toContain(labelId)
  })

  it('shows the "Manage labels" button when callback is provided', () => {
    const onManage = vi.fn()

    render(
      <LabelAssigner draftId={draftId} onManageLabels={onManage}>
        <button>Assign</button>
      </LabelAssigner>
    )

    const manageButton = screen.getByText('Manage labels')
    expect(manageButton).toBeInTheDocument()

    fireEvent.click(manageButton)
    expect(onManage).toHaveBeenCalledOnce()
  })

  it('does not show "Manage labels" button when no callback', () => {
    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    expect(screen.queryByText('Manage labels')).not.toBeInTheDocument()
  })

  it('toggles multiple labels independently', () => {
    const id1 = useResumeStore.getState().createLabel('Google', '#3b82f6')
    const id2 = useResumeStore.getState().createLabel('Frontend', '#22c55e')

    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    fireEvent.click(screen.getByLabelText('Add label Google'))
    fireEvent.click(screen.getByLabelText('Add label Frontend'))

    let draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).toContain(id1)
    expect(draft.labelIds).toContain(id2)

    // Remove only Google
    fireEvent.click(screen.getByLabelText('Remove label Google'))

    draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).not.toContain(id1)
    expect(draft.labelIds).toContain(id2)
  })

  it('creates a new label and assigns it immediately', () => {
    render(
      <LabelAssigner draftId={draftId}>
        <button>Assign</button>
      </LabelAssigner>
    )

    // Click the "Create new label" button
    const createButton = screen.getByLabelText('Create new label')
    fireEvent.click(createButton)

    // Expect form to appear
    const input = screen.getByLabelText('Label name')
    expect(input).toBeInTheDocument()

    // Fill the form
    fireEvent.change(input, { target: { value: 'New Label' } })

    // Click Save
    fireEvent.click(screen.getByText('Save'))

    // Verify label created in store
    const state = useResumeStore.getState()
    const labelId = state.labelOrder[0]
    expect(state.labelsById[labelId].name).toBe('New Label')

    // Verify assigned to draft
    const draft = state.draftsById[draftId]
    expect(draft.labelIds).toContain(labelId)

    // Verify form closed (input gone)
    expect(screen.queryByLabelText('Label name')).not.toBeInTheDocument()
  })
})
