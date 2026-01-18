'use client'

import { MdEditor } from 'md-editor-rt'
import { useResumeTheme } from '@/hooks/use-resume-theme'
import {
  getResumeAccentClassName,
  getResumeTypographyClassNames,
} from '@/lib/resume-theme'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/stores/resume-store'
import { initMdEditorConfig } from './config/editor-config'
import { useEditorState } from './hooks'
import 'md-editor-rt/lib/style.css'

import './styles.css'

initMdEditorConfig()

export default function Editor() {
  const {
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
  } = useEditorState()
  const { className: resumeThemeClassName } = useResumeTheme()
  const resumeTheme = useResumeStore((state) => state.resumeDisplay.theme)
  const resumeAccent = resumeTheme.accent
  const resumeAccentClassName = getResumeAccentClassName(resumeAccent)
  const resumeTypographyClassNames = getResumeTypographyClassNames(resumeTheme)

  return (
    <div className="flex h-full flex-col">
      <input {...uploadInputProps} />
      <MdEditor
        key={editorTheme}
        ref={editorRef}
        className={cn(
          'resume-preview-theme grow rounded-none',
          resumeThemeClassName,
          resumeAccentClassName,
          resumeTypographyClassNames,
          isFullWidth && 'resume-view-full'
        )}
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
