'use client'

import { useEditorViewStore } from '@/stores/editor-view-store'
import { Link, LinkBreak } from '@phosphor-icons/react/dist/ssr'
import ToolbarTooltipButton from './toolbar-tooltip-button'

export default function SyncScrollToggle() {
  const isSyncScrollEnabled = useEditorViewStore(
    (state) => state.isSyncScrollEnabled
  )
  const toggleSyncScroll = useEditorViewStore(
    (state) => state.toggleSyncScroll
  )

  return (
    <ToolbarTooltipButton
      label={isSyncScrollEnabled ? 'Disable Scroll Sync' : 'Enable Scroll Sync'}
      icon={
        isSyncScrollEnabled ? (
          <Link className="h-4 w-4" />
        ) : (
          <LinkBreak className="h-4 w-4" />
        )
      }
      onClick={toggleSyncScroll}
      className={isSyncScrollEnabled ? 'text-brand-primary' : 'text-muted-foreground'}
      tooltip={
        isSyncScrollEnabled
          ? 'Synchronized Scrolling is On'
          : 'Synchronized Scrolling is Off'
      }
    />
  )
}
