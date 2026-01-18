import type { ResumeBodySize, ResumeFont, ResumeHeadingSize } from '@/lib/resume-types'
import {
  bodySizeLabelByValue,
  fontLabelByValue,
  headingSizeLabelByValue,
  legacyBodySizeLabelByValue,
  legacyHeadingSizeLabelByValue,
} from './constants'

export const resolveFontLabel = (value: string | null): string => {
  if (!value) return 'Select font'
  return fontLabelByValue[value as ResumeFont] ?? 'Select font'
}

export const resolveHeadingSizeLabel = (value: string | null): string => {
  if (!value) return 'Size'
  return (
    headingSizeLabelByValue[value as ResumeHeadingSize] ??
    legacyHeadingSizeLabelByValue[value] ??
    'Size'
  )
}

export const resolveBodySizeLabel = (value: string | null): string => {
  if (!value) return 'Size'
  return (
    bodySizeLabelByValue[value as ResumeBodySize] ??
    legacyBodySizeLabelByValue[value] ??
    'Size'
  )
}
