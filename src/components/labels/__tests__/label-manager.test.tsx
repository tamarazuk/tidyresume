import type React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { LabelManager } from '../label-manager'
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

describe('LabelManager', () => {
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
  })

  it('shows empty state when no labels exist', () => {
    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    expect(
      screen.getByText('No labels yet. Create one to get started.')
    ).toBeInTheDocument()
  })

  it('shows the create form when "New label" is clicked', () => {
    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('New label'))

    expect(screen.getByLabelText('Label name')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('creates a label when the form is submitted', () => {
    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('New label'))

    const input = screen.getByLabelText('Label name')
    fireEvent.change(input, { target: { value: 'Frontend' } })
    fireEvent.click(screen.getByText('Save'))

    const state = useResumeStore.getState()
    const labels = state.labelOrder.map((id) => state.labelsById[id])
    expect(labels).toHaveLength(1)
    expect(labels[0].name).toBe('Frontend')
  })

  it('shows existing labels in the list', () => {
    useResumeStore.getState().createLabel('Google', '#3b82f6')
    useResumeStore.getState().createLabel('Frontend', '#22c55e')

    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('shows the edit form when the edit button is clicked', () => {
    useResumeStore.getState().createLabel('Original', '#ef4444')

    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('Edit Original'))

    const input = screen.getByLabelText('Label name')
    expect(input).toHaveValue('Original')
  })

  it('updates a label when the edit form is submitted', () => {
    const labelId = useResumeStore.getState().createLabel('Old Name', '#ef4444')

    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('Edit Old Name'))

    const input = screen.getByLabelText('Label name')
    fireEvent.change(input, { target: { value: 'New Name' } })
    fireEvent.click(screen.getByText('Save'))

    const label = useResumeStore.getState().labelsById[labelId]
    expect(label.name).toBe('New Name')
  })

  it('deletes a label when confirmed', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    useResumeStore.getState().createLabel('ToDelete', '#ef4444')

    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('Delete ToDelete'))

    const state = useResumeStore.getState()
    expect(state.labelOrder).toHaveLength(0)
    confirmSpy.mockRestore()
  })

  it('does not delete a label when confirm is cancelled', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    useResumeStore.getState().createLabel('KeepMe', '#ef4444')

    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('Delete KeepMe'))

    const state = useResumeStore.getState()
    expect(state.labelOrder).toHaveLength(1)
    confirmSpy.mockRestore()
  })

  it('hides the create form when Cancel is clicked', () => {
    render(
      <LabelManager>
        <button>Open</button>
      </LabelManager>
    )

    fireEvent.click(screen.getByLabelText('New label'))
    expect(screen.getByLabelText('Label name')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByLabelText('Label name')).not.toBeInTheDocument()
  })
})
