import type React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import ResumeLibrary from '../resume-library'
import { useResumeStore } from '@/stores/resume-store'

const pushMock = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

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

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

/**
 * Fully reset the zustand store to a clean single-draft state.
 * This is necessary because `resetResume()` only resets the active draft's fields,
 * while drafts from previous tests remain in the store.
 */
function resetStoreCompletely() {
  const state = useResumeStore.getState()
  // Clear all labels first
  for (const id of [...state.labelOrder]) {
    state.deleteLabel(id)
  }
  // Delete all drafts except the first one
  const allDraftIds = [...state.draftOrder]
  for (const id of allDraftIds.slice(1)) {
    state.deleteDraft(id)
  }
  // Reset the remaining draft to defaults
  state.resetResume()
}

describe('ResumeLibrary (labels)', () => {
  beforeEach(() => {
    cleanup() // Clean up DOM from previous tests
    pushMock.mockClear()
    useResumeStore.persist?.clearStorage?.()
    resetStoreCompletely()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows label filter chips when labels exist', () => {
    useResumeStore.getState().createLabel('Google', '#3b82f6')
    useResumeStore.getState().createLabel('Frontend', '#22c55e')

    render(<ResumeLibrary />)

    // Label badges should be rendered as filter chips
    expect(screen.getAllByText('Google').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Frontend').length).toBeGreaterThan(0)
  })

  it('does not show label filter row when no labels exist', () => {
    render(<ResumeLibrary />)

    // There should be no label filter chips — only the toolbar items
    expect(screen.queryByText('Google')).not.toBeInTheDocument()
  })

  it('filters resumes by label when a label chip is clicked', async () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    state.updateDraft(draftId, { resumeTitle: 'Labeled Resume' })

    const secondDraftId = state.createDraft()
    state.updateDraft(secondDraftId, { resumeTitle: 'Unlabeled Resume' })

    const labelId = state.createLabel('Google', '#3b82f6')
    state.addLabelToDraft(draftId, labelId)

    render(<ResumeLibrary />)

    // Both should be visible initially
    expect(screen.getByText('Labeled Resume')).toBeInTheDocument()
    expect(screen.getByText('Unlabeled Resume')).toBeInTheDocument()

    // Find the label filter chip within the filter chips container
    const filterChipsContainer = screen.getByTestId('label-filter-chips')
    const googleChip = filterChipsContainer.querySelector('button')
    expect(googleChip).toBeTruthy()
    fireEvent.click(googleChip!)

    // Only the labeled resume should remain
    expect(screen.getByText('Labeled Resume')).toBeInTheDocument()
    expect(screen.queryByText('Unlabeled Resume')).not.toBeInTheDocument()
  })

  it('clears label filter when the same chip is clicked again', async () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    state.updateDraft(draftId, { resumeTitle: 'Labeled Resume' })

    const secondDraftId = state.createDraft()
    state.updateDraft(secondDraftId, { resumeTitle: 'Unlabeled Resume' })

    const labelId = state.createLabel('Google', '#3b82f6')
    state.addLabelToDraft(draftId, labelId)

    render(<ResumeLibrary />)

    // Find the label filter chip within the filter chips container
    const filterChipsContainer = screen.getByTestId('label-filter-chips')
    const googleChip = filterChipsContainer.querySelector('button')
    expect(googleChip).toBeTruthy()

    // Toggle on
    fireEvent.click(googleChip!)
    expect(screen.queryByText('Unlabeled Resume')).not.toBeInTheDocument()

    // Toggle off
    fireEvent.click(googleChip!)
    expect(screen.getByText('Unlabeled Resume')).toBeInTheDocument()
  })

  it('searches by label name', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    state.updateDraft(draftId, { resumeTitle: 'My Resume' })

    const secondDraftId = state.createDraft()
    state.updateDraft(secondDraftId, { resumeTitle: 'Other Resume' })

    const labelId = state.createLabel('Google', '#3b82f6')
    state.addLabelToDraft(draftId, labelId)

    render(<ResumeLibrary />)

    const searchInput = screen.getByLabelText('Search resumes')
    fireEvent.change(searchInput, { target: { value: 'Google' } })

    // My Resume has the Google label, so it should match
    expect(screen.getByText('My Resume')).toBeInTheDocument()
    // Other Resume does not have the label
    expect(screen.queryByText('Other Resume')).not.toBeInTheDocument()
  })

  it('combines label filter with status filter', async () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    state.updateDraft(draftId, {
      resumeTitle: 'Published Labeled',
      isPublished: true,
      id: 'r-1',
    })

    const draft2Id = state.createDraft()
    state.updateDraft(draft2Id, {
      resumeTitle: 'Draft Labeled',
      isPublished: false,
    })

    const labelId = state.createLabel('Google', '#3b82f6')
    state.addLabelToDraft(draftId, labelId)
    state.addLabelToDraft(draft2Id, labelId)

    render(<ResumeLibrary />)

    // Click Google label filter
    const filterChipsContainer = screen.getByTestId('label-filter-chips')
    const googleChip = filterChipsContainer.querySelector('button')
    expect(googleChip).toBeTruthy()
    fireEvent.click(googleChip!)

    // Both labeled resumes visible
    expect(screen.getByText('Published Labeled')).toBeInTheDocument()
    expect(screen.getByText('Draft Labeled')).toBeInTheDocument()

    // Now also filter to "Drafts" only - use regex because button name includes count ("Drafts1")
    const draftsButtons = screen.getAllByRole('button', { name: /^Drafts/ })
    fireEvent.click(draftsButtons[0])

    expect(screen.queryByText('Published Labeled')).not.toBeInTheDocument()
    expect(screen.getByText('Draft Labeled')).toBeInTheDocument()
  })

  it('shows "No resumes match" when label filter excludes all', async () => {
    const state = useResumeStore.getState()
    state.updateDraft(state.getActiveDraft().draftId, {
      resumeTitle: 'No Label Resume',
    })

    state.createLabel('Exclusive', '#ef4444')
    // Don't assign the label to any draft

    render(<ResumeLibrary />)

    // The label filter chip is a button element with the label name as text content.
    // Find it by text and verify it's a button, then click
    const exclusiveElements = screen.getAllByText('Exclusive')
    // Filter to only the button elements (filter chips, not spans)
    const exclusiveButton = exclusiveElements.find(
      (el) => el.tagName === 'BUTTON'
    )
    expect(exclusiveButton).toBeTruthy()
    fireEvent.click(exclusiveButton!)

    expect(
      screen.getByText('No resumes match your criteria.')
    ).toBeInTheDocument()
  })
})
