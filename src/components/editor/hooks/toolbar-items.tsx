import type { ReactElement } from 'react'
import type { ToolbarNames } from 'md-editor-rt'
import type { ToolDirective } from 'md-editor-rt/lib/types/MdEditor/utils/content-help'
import {
  CodeIcon,
  EyeIcon,
  LinkSimpleIcon,
  ListBulletsIcon,
  ListChecksIcon,
  ListNumbersIcon,
  TableIcon,
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'

type ExecToolbarItem = {
  id: string
  label: string
  action: 'exec'
  command: ToolDirective
  icon: ReactElement
  shortcutKeys?: string[]
}

type ToggleToolbarItem = {
  id: string
  label: string
  action: 'togglePreview' | 'toggleHtmlPreview'
  icon: ReactElement
  shortcutKeys?: string[]
}

export type AriaToolbarItem = ExecToolbarItem | ToggleToolbarItem

export type CustomToolbarItemId =
  | 'undo'
  | 'redo'
  | 'heading'
  | 'shortcuts'
  | 'divider'
  | 'pageBreak'
  | 'imageMenu'
  | 'comment'
  | 'viewEditor'
  | 'viewSplit'
  | 'viewPreview'

export type AriaToolbarItemId =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'unorderedList'
  | 'orderedList'
  | 'taskList'
  | 'link'
  | 'table'
  | 'preview'
  | 'htmlPreview'

// These are custom only to add aria-labels until md-editor-rt supports them.
export const ARIA_ONLY_TOOLBAR_ITEMS: Record<
  AriaToolbarItemId,
  AriaToolbarItem
> = {
  bold: {
    id: 'bold',
    label: 'Bold',
    action: 'exec',
    command: 'bold',
    icon: <TextBIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'B'],
  },
  italic: {
    id: 'italic',
    label: 'Italic',
    action: 'exec',
    command: 'italic',
    icon: <TextItalicIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'I'],
  },
  underline: {
    id: 'underline',
    label: 'Underline',
    action: 'exec',
    command: 'underline',
    icon: <TextUnderlineIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'U'],
  },
  strikethrough: {
    id: 'strikethrough',
    label: 'Strikethrough',
    action: 'exec',
    command: 'strikeThrough',
    icon: <TextStrikethroughIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'Shift', 'S'],
  },
  unorderedList: {
    id: 'unorderedList',
    label: 'Bulleted list',
    action: 'exec',
    command: 'unorderedList',
    icon: <ListBulletsIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'Shift', 'U'],
  },
  orderedList: {
    id: 'orderedList',
    label: 'Numbered list',
    action: 'exec',
    command: 'orderedList',
    icon: <ListNumbersIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'O'],
  },
  taskList: {
    id: 'taskList',
    label: 'Task list',
    action: 'exec',
    command: 'task',
    icon: <ListChecksIcon size={16} aria-hidden />,
  },
  link: {
    id: 'link',
    label: 'Insert link',
    action: 'exec',
    command: 'link',
    icon: <LinkSimpleIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'L'],
  },
  table: {
    id: 'table',
    label: 'Insert table',
    action: 'exec',
    command: 'table',
    icon: <TableIcon size={16} aria-hidden />,
    shortcutKeys: ['Mod', 'Shift', 'Alt', 'T'],
  },
  preview: {
    id: 'preview',
    label: 'Toggle preview',
    action: 'togglePreview',
    icon: <EyeIcon size={16} aria-hidden />,
  },
  htmlPreview: {
    id: 'htmlPreview',
    label: 'Toggle HTML preview',
    action: 'toggleHtmlPreview',
    icon: <CodeIcon size={16} aria-hidden />,
  },
}

export type ToolbarLayoutItem =
  | { type: 'builtin'; name: ToolbarNames }
  | { type: 'aria'; id: AriaToolbarItemId }
  | { type: 'custom'; id: CustomToolbarItemId }
  | { type: 'separator' }
  | { type: 'align' }

export const TOOLBAR_LAYOUT: ToolbarLayoutItem[] = [
  { type: 'custom', id: 'undo' },
  { type: 'custom', id: 'redo' },
  { type: 'separator' },
  { type: 'custom', id: 'heading' },
  { type: 'aria', id: 'bold' },
  { type: 'aria', id: 'italic' },
  { type: 'aria', id: 'underline' },
  { type: 'aria', id: 'strikethrough' },
  { type: 'separator' },
  { type: 'aria', id: 'unorderedList' },
  { type: 'aria', id: 'orderedList' },
  { type: 'aria', id: 'taskList' },
  { type: 'separator' },
  { type: 'aria', id: 'link' },
  { type: 'custom', id: 'imageMenu' },
  { type: 'aria', id: 'table' },
  { type: 'separator' },
  { type: 'custom', id: 'divider' },
  { type: 'custom', id: 'pageBreak' },
  { type: 'custom', id: 'comment' },
  { type: 'align' },
  { type: 'custom', id: 'shortcuts' },
  { type: 'separator' },
  { type: 'custom', id: 'viewEditor' },
  { type: 'custom', id: 'viewSplit' },
  { type: 'custom', id: 'viewPreview' },
]
