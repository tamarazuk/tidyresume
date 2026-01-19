'use client'

import { useEditorViewStore } from '@/stores/editor-view-store'
import { Link, LinkBreak } from '@phosphor-icons/react/dist/ssr'
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
      label={isSyncScrollEnabled ? 'Disable Scroll Sync' : 'Enable Scroll Sync'}
      icon={
        isSyncScrollEnabled ? (
          <Link size={14} className="shrink-0" />
        ) : (
          <LinkBreak size={14} className="shrink-0" />
        )
      }
      onClick={toggleSyncScroll}
      className={cn(
        isSyncScrollEnabled ? 'text-brand-primary' : 'text-muted-foreground',
        className
      )}
      baseClass={baseClass}
      tooltip={
        isSyncScrollEnabled
          ? 'Synchronized Scrolling is On'
          : 'Synchronized Scrolling is Off'
      }
    />
  )
}