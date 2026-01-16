import { useCallback, useMemo, type ReactElement } from 'react'
import type { Footers } from 'md-editor-rt'
import {
  CheckCircleIcon,
  CircleIcon,
  CloudCheckIcon,
  KeyboardIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import EditorShortcutsMenu from '../components/toolbar-shortcuts-menu'
import {
  FOOTER_LAYOUT,
  type CustomFooterItemId,
  type FooterLayoutItem,
} from './footer-items'

type SaveStatus = 'saved' | 'saving' | 'unsaved'
type SyncStatus = 'synced' | 'syncing' | 'error' | 'unsaved'
type CloudStatus = 'synced' | 'syncing' | 'error'
export type EditorSaveStatus = SaveStatus

interface UseEditorFootersOptions {
  value: string
  layout?: FooterLayoutItem[]
  saveStatus?: SaveStatus
  cloudStatus?: SyncStatus
  hasCloudCopy?: boolean
  warningMessage?: string | null
  isPreviewMode?: boolean
}

interface UseEditorFootersReturn {
  footers: Footers[]
  defFooters: Array<string | ReactElement>
}

interface FooterMetricProps {
  label: string
  value: number
  className?: string
}

const saveStatusConfig: Record<
  SaveStatus,
  { label: string; icon: ReactElement; badgeClassName: string }
> = {
  saved: {
    label: 'Saved locally',
    icon: <CheckCircleIcon size={12} aria-hidden />,
    badgeClassName:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  saving: {
    label: 'Saving',
    icon: <SpinnerGapIcon size={12} aria-hidden className="animate-spin" />,
    badgeClassName:
      'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  unsaved: {
    label: 'Not saved',
    icon: <CircleIcon size={10} aria-hidden />,
    badgeClassName:
      'border-border bg-muted text-muted-foreground dark:text-muted-foreground',
  },
}

const saveStatusTooltip =
  'Saved in this browser’s local storage. You can reopen this page in the same browser anytime to keep editing'

const cloudStatusConfig: Record<
  CloudStatus,
  { label: string; icon: ReactElement; badgeClassName: string }
> = {
  synced: {
    label: 'Saved to cloud',
    icon: <CloudCheckIcon size={12} aria-hidden />,
    badgeClassName:
      'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  },
  syncing: {
    label: 'Syncing to cloud',
    icon: <SpinnerGapIcon size={12} aria-hidden className="animate-spin" />,
    badgeClassName:
      'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  error: {
    label: 'Cloud sync error',
    icon: <WarningCircleIcon size={12} aria-hidden />,
    badgeClassName:
      'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  },
}

const cloudStatusTooltip: Record<CloudStatus, string> = {
  synced: 'Your published resume is up to date in the cloud.',
  syncing: 'Updating your published resume in the cloud.',
  error: 'We could not update the published resume in the cloud.',
}

const warningTooltip =
  'Some content was too large to store locally. Try a smaller image or shorten the resume.'

const resolveCloudStatus = (
  status: SyncStatus | undefined,
  hasCloudCopy: boolean | undefined
): CloudStatus | null => {
  if (!hasCloudCopy) return null
  if (status === 'syncing' || status === 'error') return status
  return 'synced'
}

function FooterMetric({ label, value, className }: FooterMetricProps) {
  return (
    <div className={cn('md-editor-footer-item', className)}>
      <span className="md-editor-footer-label">{label}: </span>
      <span>{value}</span>
    </div>
  )
}

function countWords(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function countCharacters(value: string) {
  const dataImageRegex = /data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+/gi
  return value.replace(dataImageRegex, 'x').length
}

function useEditorFooters({
  value,
  layout = FOOTER_LAYOUT,
  saveStatus,
  cloudStatus,
  hasCloudCopy,
  warningMessage,
  isPreviewMode,
}: UseEditorFootersOptions): UseEditorFootersReturn {
  const wordCount = useMemo(() => countWords(value), [value])
  const characterCount = useMemo(() => countCharacters(value), [value])

  const buildCustomFooter = useCallback(
    (id: CustomFooterItemId) => {
// ...
    }
// ...
  )

  const { footers, defFooters } = useMemo(() => {
    if (isPreviewMode) {
      return {
        defFooters: [],
        footers: [],
      }
    }
    const footerElements: Array<string | ReactElement> = []
    const footerLayout: Footers[] = []

    const pushFooter = (element: ReactElement | string | null) => {
      if (!element) return
      const index = footerElements.length
      footerElements.push(element)
      footerLayout.push(index as Footers)
    }

    layout.forEach((item) => {
      if (item.type === 'align') {
        footerLayout.push('=')
        return
      }

      if (item.type === 'divider') {
        pushFooter(
          <span
            key={`footer-divider-${footerElements.length}`}
            className="md-editor-divider"
          />
        )
        return
      }

      if (item.type === 'builtin') {
        footerLayout.push(item.name)
        return
      }

      pushFooter(buildCustomFooter(item.id))
    })

    return {
      defFooters: footerElements,
      footers: footerLayout,
    }
  }, [buildCustomFooter, layout])

  return { footers, defFooters }
}

export { useEditorFooters }
