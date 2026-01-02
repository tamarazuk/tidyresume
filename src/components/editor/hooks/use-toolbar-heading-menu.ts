import { useCallback, type KeyboardEvent } from 'react'

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const
type HeadingLevel = (typeof HEADING_LEVELS)[number]

interface UseToolbarHeadingMenuOptions {
  onSelect: (level: HeadingLevel) => void
  levels?: readonly HeadingLevel[]
}

function useToolbarHeadingMenu({
  onSelect,
  levels,
}: UseToolbarHeadingMenuOptions) {
  const resolvedLevels = levels ?? HEADING_LEVELS

  const handleItemKeyDown = useCallback(
    (level: HeadingLevel) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(level)
      }
    },
    [onSelect]
  )

  const getItemProps = useCallback(
    (level: HeadingLevel) => ({
      onClick: () => onSelect(level),
      onKeyDown: handleItemKeyDown(level),
    }),
    [handleItemKeyDown, onSelect]
  )

  return {
    levels: resolvedLevels,
    getItemProps,
  }
}

export { HEADING_LEVELS, type HeadingLevel, useToolbarHeadingMenu }
