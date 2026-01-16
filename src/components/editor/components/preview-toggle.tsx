'use client'

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useEditorViewStore } from '@/stores/editor-view-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function PreviewToggle() {
  const isPreviewMode = useEditorViewStore(
    (state) => state.editorViewState.isPreviewMode
  )
  const setEditorViewState = useEditorViewStore(
    (state) => state.setEditorViewState
  )

  const togglePreview = () => {
    setEditorViewState({ isPreviewMode: !isPreviewMode })
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <Button
            {...props}
            variant="secondary"
            size="sm"
            onClick={togglePreview}
            aria-label="Preview as visitor"
            aria-pressed={isPreviewMode}
            className={cn(
              'gap-1.5 px-3 transition-colors',
              isPreviewMode &&
                'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {isPreviewMode ? (
              <EyeSlashIcon size={16} weight="bold" />
            ) : (
              <EyeIcon size={16} weight="bold" />
            )}
            <span>Preview</span>
          </Button>
        )}
      />
      <TooltipContent side="bottom" align="center">
        {isPreviewMode ? 'Return to editing' : 'See what visitors see'}
      </TooltipContent>
    </Tooltip>
  )
}
