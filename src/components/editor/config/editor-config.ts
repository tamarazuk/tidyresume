'use client'

import { config } from 'md-editor-rt'

import {
  buildCodeMirrorExtensions,
  configureMarkdownIt,
  filterMarkdownItPlugins,
} from './editor-extensions'

let configured = false

export function initMdEditorConfig() {
  if (configured) return
  configured = true
  config({
    editorConfig: {
      languageUserDefined: {
        'en-US': {
          toolbarTips: {
            revoke: 'Undo',
            next: 'Redo',
          },
        },
      },
    },
    codeMirrorExtensions: buildCodeMirrorExtensions,
    markdownItConfig: configureMarkdownIt,
    markdownItPlugins: filterMarkdownItPlugins,
  })
}
