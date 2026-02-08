import type React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ResumeSwitcher from '@/components/layout/resume-switcher'
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
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({
    render,
  }: {
    render: (props: Record<string, unknown>) => React.ReactNode
  }) => <div>{render({})}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: () => null,
  DialogContent: () => null,
  DialogTitle: () => null,
}))

describe('ResumeSwitcher', () => {
  beforeEach(() => {
    pushMock.mockClear()
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()

    const state = useResumeStore.getState()
    const firstDraft = state.getActiveDraft()
    state.updateDraft(firstDraft.draftId, {
      resumeTitle: 'Published Resume',
      id: 'remote-1',
      slug: 'published-resume',
      isPublished: true,
    })

    const secondDraftId = state.createDraft()
    state.updateDraft(secondDraftId, {
      resumeTitle: 'Draft Resume',
      isPublished: false,
      id: null,
      slug: null,
    })
    state.setActiveDraft(firstDraft.draftId)
  })

  it('switches to a selected draft and navigates to the draft url', () => {
    render(<ResumeSwitcher />)

    fireEvent.click(screen.getByLabelText('Open Draft Resume'))

    const activeDraft = useResumeStore.getState().getActiveDraft()
    expect(activeDraft.resumeTitle).toBe('Draft Resume')
    expect(pushMock).toHaveBeenCalledWith(`/edit/${activeDraft.draftId}`)
  })

  it('duplicates a draft and navigates to the new draft url', () => {
    const initialDraftCount = useResumeStore.getState().draftOrder.length
    render(<ResumeSwitcher />)

    fireEvent.click(
      screen.getAllByLabelText('Duplicate Published Resume')[0]
    )

    expect(pushMock).toHaveBeenCalledTimes(1)
    const destination = pushMock.mock.calls[0]?.[0] as string
    expect(destination.startsWith('/edit/')).toBe(true)
    expect(useResumeStore.getState().draftOrder.length).toBeGreaterThan(
      initialDraftCount
    )
  })

  it('opens the public link for published drafts', () => {
    render(<ResumeSwitcher />)

    fireEvent.click(
      screen.getAllByLabelText('Open public link for Published Resume')[0]
    )

    expect(pushMock).toHaveBeenCalledWith('/r/published-resume')
  })
})
