'use client'

export interface PlatformShortcuts {
  modifierKey: 'Cmd' | 'Ctrl'
  formatShortcutKeys: (keys: string[]) => string[]
}

export default function usePlatformShortcuts(): PlatformShortcuts {
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  const modifierKey: PlatformShortcuts['modifierKey'] = isMac ? 'Cmd' : 'Ctrl'

  const formatShortcutKeys = (keys: string[]) => {
    return keys.map((key) => (key === 'Mod' ? modifierKey : key))
  }

  return { modifierKey, formatShortcutKeys }
}
