import type React from 'react'
import { render, screen, act, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ResumeViewer } from '@/components/public-view/resume-viewer'
import { updateResumeTheme } from '@/lib/resume-api'
import { useResumeStore } from '@/stores/resume-store'

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
  default: () => <div data-testid="appearance-settings" />,
}))

vi.mock('@/components/layout/slug-settings', () => ({
  SlugSettings: () => <div data-testid="slug-settings" />,
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
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.setState((state) => ({
      ...state,
      id: 'resume-123',
      editSecret: 'secret-123',
      resumeDisplay: {
        ...state.resumeDisplay,
        theme: {
          ...state.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    }))
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

  it('uses the server theme for visitors', () => {
    useResumeStore.setState((state) => ({
      ...state,
      id: 'other-id',
      resumeDisplay: {
        ...state.resumeDisplay,
        theme: {
          ...state.resumeDisplay.theme,
          accent: 'indigo',
        },
      },
    }))

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
      vi.advanceTimersByTime(2600)
    })

    expect(updateResumeTheme).toHaveBeenCalledWith(
      'resume-123',
      expect.objectContaining({ accent: 'teal' }),
      { editSecret: 'secret-123' }
    )
  })

  it('does not publish on mount when the theme matches the server', async () => {
    vi.useFakeTimers()
    const matchingTheme = useResumeStore.getState().resumeDisplay.theme
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
      vi.advanceTimersByTime(2600)
    })

    expect(updateResumeTheme).not.toHaveBeenCalled()
  })
})
