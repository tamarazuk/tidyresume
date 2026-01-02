import type { Footers } from 'md-editor-rt'

export type CustomFooterItemId =
  | 'shortcutTips'
  | 'wordCount'
  | 'characterCount'
  | 'saveStatus'
  | 'warning'

export type FooterLayoutItem =
  | { type: 'builtin'; name: Footers }
  | { type: 'custom'; id: CustomFooterItemId }
  | { type: 'divider' }
  | { type: 'align' }

export const FOOTER_LAYOUT: FooterLayoutItem[] = [
  { type: 'custom', id: 'saveStatus' },
  { type: 'custom', id: 'warning' },
  { type: 'align' },
  { type: 'custom', id: 'wordCount' },
  { type: 'divider' },
  { type: 'custom', id: 'characterCount' },
]
