import { PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import {
  dropdownMenuContentClassName,
  dropdownMenuItemClassName,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ToolbarImageMenuProps {
  onInsert: () => void
  onUpload: () => void
}

export default function ToolbarImageMenu({
  onInsert,
  onUpload,
}: ToolbarImageMenuProps) {
  return (
    <div role="menu" className={cn(dropdownMenuContentClassName, 'w-48')}>
      <Button
        type="button"
        role="menuitem"
        variant="ghost"
        size="sm"
        className={cn(dropdownMenuItemClassName, 'w-full justify-start')}
        onClick={onInsert}
      >
        <PlusIcon size={16} aria-hidden />
        Insert image
      </Button>
      <Button
        type="button"
        role="menuitem"
        variant="ghost"
        size="sm"
        className={cn(dropdownMenuItemClassName, 'w-full justify-start')}
        onClick={onUpload}
      >
        <UploadSimpleIcon size={16} aria-hidden />
        Upload image
      </Button>
    </div>
  )
}
