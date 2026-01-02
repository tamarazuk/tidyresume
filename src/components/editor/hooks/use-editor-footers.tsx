import { useCallback, useMemo, type ReactElement } from 'react'
import type { Footers } from 'md-editor-rt'
import {
  CheckCircleIcon,
  CircleIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  FOOTER_LAYOUT,
  type CustomFooterItemId,
  type FooterLayoutItem,
} from './footer-items'

type SaveStatus = 'saved' | 'saving' | 'unsaved'
export type EditorSaveStatus = SaveStatus

interface UseEditorFootersOptions {
  value: string
  layout?: FooterLayoutItem[]
  saveStatus?: SaveStatus
  warningMessage?: string | null
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

const warningTooltip =
  'Some content was too large to store locally. Try a smaller image or shorten the resume.'

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
  warningMessage,
}: UseEditorFootersOptions): UseEditorFootersReturn {
  const wordCount = useMemo(() => countWords(value), [value])
  const characterCount = useMemo(() => countCharacters(value), [value])

  const buildCustomFooter = useCallback(
    (id: CustomFooterItemId) => {
      switch (id) {
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
        case 'saveStatus':
          if (!saveStatus) return null
          return (
            <div key="footer-save-status" className="md-editor-footer-item">
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
    [characterCount, saveStatus, warningMessage, wordCount]
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
