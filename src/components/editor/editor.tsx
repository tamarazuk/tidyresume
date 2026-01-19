'use client'

import { MdEditor } from 'md-editor-rt'
import { useResumeTheme } from '@/hooks/use-resume-theme'
import { useResumeAppearanceClasses } from '@/hooks/use-resume-appearance-classes'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'
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
    isSyncScrollEnabled,
  } = useEditorState()
  const { className: resumeThemeClassName } = useResumeTheme()
  const { accentClassName, typographyClassNames } =
    useResumeAppearanceClasses()

  return (
    <div className="flex h-full flex-col">
      <input {...uploadInputProps} />
      <MdEditor
        key={editorTheme}
        ref={editorRef}
        className={cn(
          'resume-preview-theme grow rounded-none',
          resumeThemeClassName,
          accentClassName,
          typographyClassNames,
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
        scrollAuto={false}
      />
    </div>
  )
}
