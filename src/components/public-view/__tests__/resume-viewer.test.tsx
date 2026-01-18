import type React from 'react'
import { render, screen, act, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ResumeViewer } from '@/components/public-view/resume-viewer'
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

describe('ResumeViewer', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.setState((state) => ({
      ...state,
      id: 'resume-123',
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
})
