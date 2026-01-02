'use client'

import { Kbd } from '@/components/ui/kbd'
import {
  dropdownMenuContentClassName,
  dropdownMenuItemClassName,
} from '@/components/ui/dropdown-menu'
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
import { cn } from '@/lib/utils'

const SHORTCUT_ITEMS = [
  { label: 'Bold', keys: ['Mod', 'B'] },
  { label: 'Italic', keys: ['Mod', 'I'] },
  { label: 'Underline', keys: ['Mod', 'U'] },
  { label: 'Strikethrough', keys: ['Mod', 'Shift', 'S'] },
  { label: 'Link', keys: ['Mod', 'L'] },
  { label: 'Bulleted list', keys: ['Mod', 'Shift', 'U'] },
  { label: 'Numbered list', keys: ['Mod', 'O'] },
  { label: 'Heading 1-6', keys: ['Mod', '1-6'] },
  { label: 'Image', keys: ['Mod', 'Shift', 'I'] },
  { label: 'Table', keys: ['Mod', 'Shift', 'Alt', 'T'] },
  { label: 'Inline code', keys: ['Mod', 'Alt', 'C'] },
  { label: 'Code block', keys: ['Mod', 'Shift', 'C'] },
  { label: 'Undo', keys: ['Mod', 'Z'] },
  { label: 'Redo', keys: ['Mod', 'Shift', 'Z'] },
]

export default function EditorShortcutsMenu() {
  const { formatShortcutKeys } = usePlatformShortcuts()

  return (
    <div role="menu" className={cn(dropdownMenuContentClassName, 'w-72')}>
      <div className="px-2 py-1.5">
        <div className="text-sm font-semibold">Editor shortcuts</div>
        <div className="text-muted-foreground text-xs">
          Common formatting actions.
        </div>
      </div>
      <div className="grid gap-2 px-2 pb-2 text-xs">
        {SHORTCUT_ITEMS.map((item) => {
          const keys = formatShortcutKeys(item.keys)
          return (
            <div
              key={`${item.label}-${item.keys.join('-')}`}
              role="menuitem"
              className={cn(
                dropdownMenuItemClassName,
                'justify-between text-xs'
              )}
            >
              <span>{item.label}</span>
              <div className="flex items-center gap-1">
                {keys.map((key) => (
                  <Kbd key={`${item.label}-${key}`}>{key}</Kbd>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
