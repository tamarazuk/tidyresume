import type { ReactElement } from 'react'
import {
  TextHOneIcon,
  TextHTwoIcon,
  TextHThreeIcon,
  TextHFourIcon,
  TextHFiveIcon,
  TextHSixIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import {
  dropdownMenuContentClassName,
  dropdownMenuItemClassName,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  useToolbarHeadingMenu,
  HEADING_LEVELS,
  type HeadingLevel,
} from '../hooks'

interface ToolbarHeadingMenuProps {
  levels?: readonly HeadingLevel[]
  onSelect: (level: HeadingLevel) => void
}

export default function ToolbarHeadingMenu({
  levels = HEADING_LEVELS,
  onSelect,
}: ToolbarHeadingMenuProps) {
  const { levels: resolvedLevels, getItemProps } = useToolbarHeadingMenu({
    levels,
    onSelect,
  })

  const headingIcons: Record<HeadingLevel, ReactElement> = {
    1: <TextHOneIcon size={16} aria-hidden />,
    2: <TextHTwoIcon size={16} aria-hidden />,
    3: <TextHThreeIcon size={16} aria-hidden />,
    4: <TextHFourIcon size={16} aria-hidden />,
    5: <TextHFiveIcon size={16} aria-hidden />,
    6: <TextHSixIcon size={16} aria-hidden />,
  }

  return (
    <div role="menu" className={cn(dropdownMenuContentClassName, 'w-48')}>
      {resolvedLevels.map((level) => (
        <Button
          key={`level-${level}`}
          type="button"
          role="menuitem"
          variant="ghost"
          size="sm"
          className={cn(dropdownMenuItemClassName, 'w-full justify-start')}
          {...getItemProps(level)}
        >
          {headingIcons[level]}
          Heading {level}
        </Button>
      ))}
    </div>
  )
}

export { type HeadingLevel }
