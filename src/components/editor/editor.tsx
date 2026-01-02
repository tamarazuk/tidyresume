'use client'

import { useRef } from 'react'
import { MdEditor, type ExposeParam } from 'md-editor-rt'
import { useTheme } from '@/hooks/use-theme'
import { usePrintCleanup } from '@/hooks/use-print-cleanup'
import { usePrintTitle } from '@/hooks/use-print-title'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { useResumeStore } from '@/stores/resume-store'
import { initMdEditorConfig } from './config/editor-config'
import { useEditorFooters, useEditorToolbars } from './hooks'
import 'md-editor-rt/lib/style.css'

import './styles.css'

initMdEditorConfig()

export default function EditorToolbarExample() {
  usePrintCleanup()
  usePrintTitle()
  const editorRef = useRef<ExposeParam>(null)
  const text = useResumeStore((state) => state.markdown)
  const saveStatus = useResumeStore((state) => state.saveStatus)
  const imageWarning = useResumeStore((state) => state.imageWarning)
  const contentWarning = useResumeStore((state) => state.contentWarning)
  const setText = useResumeStore((state) => state.setMarkdown)
  const theme = useTheme()
  const editorTheme = theme
  const { toolbars, defToolbars, uploadInputProps } = useEditorToolbars({
    editorRef,
  })
  const { footers, defFooters } = useEditorFooters({
    value: text,
    saveStatus,
    warningMessage: contentWarning ?? imageWarning,
  })

  return (
    <div className="flex h-full flex-col">
      <input {...uploadInputProps} />
      <MdEditor
        key={editorTheme}
        ref={editorRef}
        className="resume-preview-theme grow rounded-none"
        value={text}
        onChange={setText}
        language="en-US"
        toolbars={toolbars}
        defToolbars={defToolbars}
        footers={footers}
        defFooters={defFooters}
        sanitize={sanitizeHtml}
        theme={editorTheme}
      />
    </div>
  )
}
