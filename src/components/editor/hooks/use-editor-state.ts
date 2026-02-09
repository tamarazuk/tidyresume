import { useCallback, useRef, useState } from 'react'
import type { ExposeParam } from 'md-editor-rt'
import { useTheme } from '@/hooks/use-theme'
import { usePrintCleanup } from '@/hooks/use-print-cleanup'
import { usePrintTitle } from '@/hooks/use-print-title'
import { useResumeSync } from '@/hooks/use-resume-sync'
import { useRemoteStatus } from '@/hooks/use-remote-status'
import { useResumeStore } from '@/stores/resume-store'
import { useEditorViewStore } from '@/stores/editor-view-store'
import { useEditorFooters } from './use-editor-footers'
import { useEditorToolbars } from './use-editor-toolbars'
import { useSynchronizedScroll } from './use-synchronized-scroll'

export function useEditorState() {
  usePrintCleanup()
  usePrintTitle()
  const { retry } = useResumeSync()
  useRemoteStatus()

  const editorRef = useRef<ExposeParam>(null)
  const draft = useResumeStore((state) => state.getActiveDraft())
  const text = draft.markdown
  const saveStatus = draft.saveStatus
  const syncStatus = draft.syncStatus
  const isPublished = draft.isPublished
  const imageWarning = draft.imageWarning
  const contentWarning = draft.contentWarning
  const setText = useResumeStore((state) => state.setMarkdown)
  const [isFullWidth, setIsFullWidth] = useState(true)
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false)
  const editorTheme = useTheme()
  const toggleFullWidth = useCallback(() => {
    setIsFullWidth((prev) => !prev)
  }, [])
  const toggleAppearance = useCallback(() => {
    setIsAppearanceOpen((prev) => !prev)
  }, [])

  const isSyncScrollEnabled = useEditorViewStore(
    (state) => state.isSyncScrollEnabled
  )
  const editorViewState = useEditorViewStore((state) => state.editorViewState)

  // Only enable sync scroll if globally enabled AND we are in split view (both panes visible)
  const shouldEnableSyncScroll =
    isSyncScrollEnabled &&
    editorViewState.preview &&
    !editorViewState.previewOnly

  useSynchronizedScroll(editorRef, shouldEnableSyncScroll, editorViewState)

  const { toolbars, defToolbars, uploadInputProps } = useEditorToolbars({
    editorRef,
    isFullWidth,
    onToggleFullWidth: toggleFullWidth,
    isAppearanceOpen,
    onToggleAppearance: toggleAppearance,
  })
  const { footers, defFooters } = useEditorFooters({
    value: text,
    saveStatus,
    cloudStatus: syncStatus,
    hasCloudCopy: isPublished,
    warningMessage: contentWarning ?? imageWarning,
    onRetry: retry,
  })

  return {
    editorRef,
    text,
    setText,
    isFullWidth,
    isAppearanceOpen,
    setIsAppearanceOpen,
    editorTheme,
    toolbars,
    defToolbars,
    uploadInputProps,
    footers,
    defFooters,
    isSyncScrollEnabled,
  }
}
