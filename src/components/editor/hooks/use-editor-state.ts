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
  const text = useResumeStore((state) => state.markdown)
  const saveStatus = useResumeStore((state) => state.saveStatus)
  const syncStatus = useResumeStore((state) => state.syncStatus)
  const isPublished = useResumeStore((state) => state.isPublished)
  const imageWarning = useResumeStore((state) => state.imageWarning)
  const contentWarning = useResumeStore((state) => state.contentWarning)
  const setText = useResumeStore((state) => state.setMarkdown)
  const [isFullWidth, setIsFullWidth] = useState(true)
  const editorTheme = useTheme()
  const toggleFullWidth = useCallback(() => {
    setIsFullWidth((prev) => !prev)
  }, [])

  const isSyncScrollEnabled = useEditorViewStore(
    (state) => state.isSyncScrollEnabled
  )
  useSynchronizedScroll(editorRef, isSyncScrollEnabled)

  const { toolbars, defToolbars, uploadInputProps } = useEditorToolbars({
    editorRef,
    isFullWidth,
    onToggleFullWidth: toggleFullWidth,
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
    editorTheme,
    toolbars,
    defToolbars,
    uploadInputProps,
    footers,
    defFooters,
    isSyncScrollEnabled,
  }
}
