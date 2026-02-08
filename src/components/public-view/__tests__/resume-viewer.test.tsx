import type React from 'react'
import { render, screen, act, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ResumeViewer } from '@/components/public-view/resume-viewer'
import { updateResumeTheme } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'

const appearanceSettingsProps = vi.fn()
const slugSettingsProps = vi.fn()

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

vi.mock('md-editor-rt', () => ({
  MdPreview: ({ className }: { className?: string }) => (
    <div data-testid="preview" className={className} />
  ),
  config: vi.fn(),
}))

vi.mock('@/icons/app-icon', () => ({
  default: () => <div data-testid="app-icon" />,
}))

vi.mock('@/components/appearance-settings', () => ({
  default: (props: { draftId?: string }) => {
    appearanceSettingsProps(props)
    return <div data-testid="appearance-settings" />
  },
}))

vi.mock('@/components/layout/slug-settings', () => ({
  SlugSettings: (props: { draftId?: string }) => {
    slugSettingsProps(props)
    return <div data-testid="slug-settings" />
  },
}))

vi.mock('@/components/public-view/unpublish-button', () => ({
  UnpublishButton: () => <div data-testid="unpublish-button" />,
}))

vi.mock('@/components/public-view/editable-resume-title', () => ({
  EditableResumeTitle: ({ title }: { title: string }) => (
    <div data-testid="editable-title">{title}</div>
  ),
}))

vi.mock('@/components/ui/theme-toggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipTrigger: ({
    render,
  }: {
    render: (props: Record<string, unknown>) => React.ReactNode
  }) => <div>{render({})}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
  DropdownMenuTrigger: ({
    render,
  }: {
    render: (props: Record<string, unknown>) => React.ReactNode
  }) => <div>{render({})}</div>,
  dropdownMenuItemClassName: 'dropdown-item',
}))

vi.mock('@/lib/resume-api', () => ({
  updateResumeTheme: vi.fn(),
  isResumeApiError: () => false,
}))

describe('ResumeViewer', () => {
  beforeEach(() => {
    appearanceSettingsProps.mockClear()
    slugSettingsProps.mockClear()
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    const state = useResumeStore.getState()
    const draftIdsToDelete = state.draftOrder.filter(
      (draftId) => draftId !== state.activeDraftId
    )
    draftIdsToDelete.forEach((draftId) => {
      state.deleteDraft(draftId)
    })
    const draft = useResumeStore.getState().getActiveDraft()
    useResumeStore.getState().updateDraft(draft.draftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: 'secret-123',
      resumeDisplay: {
        ...draft.resumeDisplay,
        theme: {
          ...draft.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    cleanup()
  })

  it('uses the store theme for owners and updates on accent changes', async () => {
    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={{ accent: 'rose' }}
      />
    )

    const preview = screen.getByTestId('preview')
    expect(preview.className).toContain('resume-accent-indigo')

    act(() => {
      useResumeStore.getState().setResumeAccent('teal')
    })

    await waitFor(() => {
      expect(preview.className).toContain('resume-accent-teal')
    })
  })

  it('passes owner draftId to owner-only controls even when another draft is active', () => {
    const state = useResumeStore.getState()
    const ownerDraftId = state.getActiveDraft().draftId
    state.createDraft()

    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={{ accent: 'rose' }}
      />
    )

    expect(
      appearanceSettingsProps.mock.calls.some(
        ([props]) => props?.draftId === ownerDraftId
      )
    ).toBe(true)
    expect(
      slugSettingsProps.mock.calls.some(
        ([props]) => props?.draftId === ownerDraftId
      )
    ).toBe(true)
  })

  it('uses the server theme for visitors', () => {
    const draft = useResumeStore.getState().getActiveDraft()
    useResumeStore.getState().updateDraft(draft.draftId, {
      id: 'other-id',
      resumeDisplay: {
        ...draft.resumeDisplay,
        theme: {
          ...draft.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    })

    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={{ accent: 'rose' }}
      />
    )

    const preview = screen.getByTestId('preview')
    expect(preview.className).toContain('resume-accent-rose')
  })

  it('treats matching drafts without edit secret as visitors', () => {
    const draft = useResumeStore.getState().getActiveDraft()
    useResumeStore.getState().updateDraft(draft.draftId, {
      id: 'resume-123',
      isPublished: true,
      editSecret: null,
      resumeDisplay: {
        ...draft.resumeDisplay,
        theme: {
          ...draft.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    })

    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={{ accent: 'rose' }}
      />
    )

    const preview = screen.getByTestId('preview')
    expect(preview.className).toContain('resume-accent-rose')
  })

  it('publishes theme changes made in the owner view', async () => {
    vi.useFakeTimers()
    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={{ accent: 'indigo' }}
      />
    )

    act(() => {
      useResumeStore.getState().setResumeAccent('teal')
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600)
    })

    expect(updateResumeTheme).toHaveBeenCalledWith(
      'resume-123',
      expect.objectContaining({ accent: 'teal' }),
      { editSecret: 'secret-123' }
    )
  })

  it('updates sync status on the viewed owner draft, not the active draft', async () => {
    vi.useFakeTimers()
    const state = useResumeStore.getState()
    const ownerDraftId = state.getActiveDraft().draftId
    const activeDraftId = state.createDraft()

    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={{ accent: 'indigo' }}
      />
    )

    act(() => {
      useResumeStore.getState().setDraftTheme(ownerDraftId, { accent: 'teal' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600)
    })
    expect(updateResumeTheme).toHaveBeenCalledWith(
      'resume-123',
      expect.objectContaining({ accent: 'teal' }),
      { editSecret: 'secret-123' }
    )

    const nextState = useResumeStore.getState()
    expect(nextState.draftsById[ownerDraftId]?.syncStatus).toBe('synced')
    expect(nextState.draftsById[activeDraftId]?.syncStatus).toBe('unsaved')
  })

  it('does not publish on mount when the theme matches the server', async () => {
    vi.useFakeTimers()
    const matchingTheme = useResumeStore
      .getState()
      .getActiveDraft()
      .resumeDisplay.theme
    render(
      <ResumeViewer
        id="resume-123"
        title="Resume"
        content="Content"
        isFullWidth={false}
        theme={matchingTheme}
      />
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2600)
    })

    expect(updateResumeTheme).not.toHaveBeenCalled()
  })
})
