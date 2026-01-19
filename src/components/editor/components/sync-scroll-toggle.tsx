'use client'

import { useEditorViewStore } from '@/stores/editor-view-store'
import { ArrowsDownUp } from '@phosphor-icons/react/dist/ssr'
import ToolbarTooltipButton from './toolbar-tooltip-button'
import { cn } from '@/lib/utils'

interface SyncScrollToggleProps {
  className?: string
  baseClass?: string
}

export default function SyncScrollToggle({
  className,
  baseClass,
}: SyncScrollToggleProps) {
  const isSyncScrollEnabled = useEditorViewStore(
    (state) => state.isSyncScrollEnabled
  )
  const toggleSyncScroll = useEditorViewStore((state) => state.toggleSyncScroll)

  return (
    <ToolbarTooltipButton
      label={isSyncScrollEnabled ? 'Disable Sync Scroll' : 'Enable Sync Scroll'}
      icon={<ArrowsDownUp size={14} className="shrink-0" />}
      onClick={toggleSyncScroll}
      className={cn(
        isSyncScrollEnabled
          ? 'bg-brand-primary/10 text-brand-primary'
          : 'text-muted-foreground/50',
        className
      )}
      baseClass={baseClass}
      tooltip={isSyncScrollEnabled ? 'Turn Sync Scroll Off' : 'Turn Sync Scroll On'}
    />
  )
}
