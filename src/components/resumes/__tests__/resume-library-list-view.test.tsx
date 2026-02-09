import type React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import ResumeLibrary from '../resume-library'
import { useResumeStore } from '@/stores/resume-store'

// Mock dependencies
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

// Mock localStorage for view mode
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('ResumeLibrary (List View)', () => {
  beforeEach(() => {
    cleanup()
    pushMock.mockClear()
    localStorageMock.clear()
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()

    // Set view mode to list
    localStorageMock.setItem('tidyresume:library-view', 'list')
  })

  afterEach(() => {
    cleanup()
  })

  it('renders actions in list view', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    state.updateDraft(draftId, {
      resumeTitle: 'List View Resume',
      isPublished: true,
      id: 'r-123',
      slug: 'my-resume',
    })

    render(<ResumeLibrary />)

    // Verify we are in list view by looking for the row specific structure or class
    // But since we mocked localStorage, it should default to list view.
    // Let's verify the actions are present.

    // 1. Assign Labels button (TagIcon)
    const assignLabelsBtn = screen.getByLabelText('Assign labels')
    expect(assignLabelsBtn).toBeInTheDocument()

    // 2. Public Link button (ArrowSquareOutIcon) - only for published
    const publicLinkBtn = screen.getByLabelText('Public link')
    expect(publicLinkBtn).toBeInTheDocument()
    expect(publicLinkBtn.closest('a')).toHaveAttribute('href', '/r/my-resume')

    // 3. Duplicate button
    const duplicateBtn = screen.getByLabelText('Duplicate resume')
    expect(duplicateBtn).toBeInTheDocument()

    // 4. Delete button
    const deleteBtn = screen.getByLabelText('Delete resume')
    expect(deleteBtn).toBeInTheDocument()
  })

  it('does not show public link for drafts', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    state.updateDraft(draftId, {
      resumeTitle: 'Draft Resume',
      isPublished: false,
    })

    render(<ResumeLibrary />)

    expect(screen.queryByLabelText('Public link')).not.toBeInTheDocument()
  })
})
