import { useCallback, useMemo, type ReactElement } from 'react'
import type { Footers } from 'md-editor-rt'
import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  CircleIcon,
  CloudCheckIcon,
  KeyboardIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import SyncScrollToggle from '../components/sync-scroll-toggle'
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
  onRetry?: () => void
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
  onRetry,
}: UseEditorFootersOptions): UseEditorFootersReturn {
  const wordCount = useMemo(() => countWords(value), [value])
  const characterCount = useMemo(() => countCharacters(value), [value])

  const buildCustomFooter = useCallback(
    (id: CustomFooterItemId) => {
      switch (id) {
        case 'shortcutTips':
          return (
            <Popover key="footer-shortcut-tips">
              <PopoverTrigger
                type="button"
                className={cn(
                  'md-editor-footer-item text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition'
                )}
                aria-label="Keyboard shortcuts"
              >
                <KeyboardIcon size={14} aria-hidden />
                Shortcuts
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={8}
                className="bg-transparent p-0 shadow-none ring-0"
              >
                <EditorShortcutsMenu />
              </PopoverContent>
            </Popover>
          )
        case 'wordCount':
          return (
            <FooterMetric
              key="footer-word-count"
              label="Words"
              value={wordCount}
            />
          )
        case 'characterCount':
          return (
            <FooterMetric
              key="footer-character-count"
              label="Characters"
              value={characterCount}
            />
          )
        case 'syncScrollToggle':
          return (
            <SyncScrollToggle
              key="footer-sync-scroll-toggle"
              baseClass="md-editor-footer-item"
              className="hover:text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium transition"
            />
          )
        case 'saveStatus':
          if (!saveStatus) return null
          const resolvedCloudStatus = resolveCloudStatus(
            cloudStatus,
            hasCloudCopy
          )
          return (
            <div
              key="footer-save-status"
              className="md-editor-footer-item flex flex-wrap items-center gap-2"
            >
              <Tooltip>
                <TooltipTrigger
                  render={(props) => {
                    const { className: triggerClassName, ...rest } = props
                    return (
                      <span
                        {...rest}
                        className={cn('inline-flex', triggerClassName)}
                      >
                        <Badge
                          variant="secondary"
                          data-icon="inline-start"
                          className={cn(
                            'border',
                            saveStatusConfig[saveStatus].badgeClassName
                          )}
                        >
                          {saveStatusConfig[saveStatus].icon}
                          <span>{saveStatusConfig[saveStatus].label}</span>
                        </Badge>
                      </span>
                    )
                  }}
                />
                <TooltipContent>{saveStatusTooltip}</TooltipContent>
              </Tooltip>
              {resolvedCloudStatus ? (
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger
                      render={(props) => {
                        const { className: triggerClassName, ...rest } = props
                        return (
                          <span
                            {...rest}
                            className={cn('inline-flex', triggerClassName)}
                          >
                            <Badge
                              variant="secondary"
                              data-icon="inline-start"
                              className={cn(
                                'border',
                                cloudStatusConfig[resolvedCloudStatus]
                                  .badgeClassName
                              )}
                            >
                              {cloudStatusConfig[resolvedCloudStatus].icon}
                              <span>
                                {cloudStatusConfig[resolvedCloudStatus].label}
                              </span>
                            </Badge>
                          </span>
                        )
                      }}
                    />
                    <TooltipContent>
                      {cloudStatusTooltip[resolvedCloudStatus]}
                    </TooltipContent>
                  </Tooltip>
                  {resolvedCloudStatus === 'error' && onRetry && (
                    <Tooltip>
                      <TooltipTrigger
                        render={(props) => (
                          <Button
                            {...props}
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-5 w-5 p-0"
                            onClick={onRetry}
                            aria-label="Retry sync"
                          >
                            <ArrowCounterClockwiseIcon size={12} />
                          </Button>
                        )}
                      />
                      <TooltipContent>Retry sync</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ) : null}
            </div>
          )
        case 'warning':
          if (!warningMessage) return null
          return (
            <div key="footer-warning" className="md-editor-footer-item">
              <Tooltip>
                <TooltipTrigger
                  render={(props) => {
                    const { className: triggerClassName, ...rest } = props
                    return (
                      <span
                        {...rest}
                        className={cn('inline-flex', triggerClassName)}
                      >
                        <Badge
                          variant="secondary"
                          data-icon="inline-start"
                          className="border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        >
                          <WarningCircleIcon size={12} aria-hidden />
                          <span>{warningMessage}</span>
                        </Badge>
                      </span>
                    )
                  }}
                />
                <TooltipContent>{warningTooltip}</TooltipContent>
              </Tooltip>
            </div>
          )
        default:
          return null
      }
    },
    [
      characterCount,
      cloudStatus,
      hasCloudCopy,
      saveStatus,
      warningMessage,
      wordCount,
      onRetry,
    ]
  )

  const { footers, defFooters } = useMemo(() => {
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