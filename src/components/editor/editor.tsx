'use client'

import { MdEditor } from 'md-editor-rt'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'
import { initMdEditorConfig } from './config/editor-config'
import { useEditorState } from './hooks'
import { useEditorViewStore } from '@/stores/editor-view-store'
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
  const isPreviewMode = useEditorViewStore(
    (state) => state.editorViewState.isPreviewMode
  )

  return (
    <div className="flex h-full flex-col">
      <input {...uploadInputProps} />
      <MdEditor
        key={editorTheme}
        ref={editorRef}
        className={cn(
          'resume-preview-theme grow rounded-none',
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
