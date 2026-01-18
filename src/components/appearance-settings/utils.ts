import type {
  ResumeBodyLineHeight,
  ResumeBodyLetterSpacing,
  ResumeBodySize,
  ResumeFont,
  ResumeHeadingSize,
} from '@/types/resume'
import {
  RESUME_BODY_LINE_HEIGHT_OPTIONS,
  RESUME_BODY_LETTER_SPACING_OPTIONS,
  RESUME_BODY_SIZE_OPTIONS,
  RESUME_FONT_OPTIONS,
  RESUME_HEADING_SIZE_OPTIONS,
} from '@/lib/resume-theme'
import {
  legacyBodySizeLabelByValue,
  legacyHeadingSizeLabelByValue,
} from './constants'

export type ResumeSelectOption<T extends string> = {
  value: T
  label: string
}

const createLabelMap = <T extends string>(
  options: ResumeSelectOption<T>[]
): Record<T, string> => {
  return options.reduce<Record<T, string>>((acc, option) => {
    acc[option.value] = option.label
    return acc
  }, {} as Record<T, string>)
}

export const fontLabelByValue = createLabelMap<ResumeFont>(
  RESUME_FONT_OPTIONS
)
export const headingSizeLabelByValue = createLabelMap<ResumeHeadingSize>(
  RESUME_HEADING_SIZE_OPTIONS
)
export const bodySizeLabelByValue = createLabelMap<ResumeBodySize>(
  RESUME_BODY_SIZE_OPTIONS
)
export const bodyLineHeightLabelByValue = createLabelMap<ResumeBodyLineHeight>(
  RESUME_BODY_LINE_HEIGHT_OPTIONS
)
export const bodyLetterSpacingLabelByValue =
  createLabelMap<ResumeBodyLetterSpacing>(RESUME_BODY_LETTER_SPACING_OPTIONS)

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

export const resolveBodyLineHeightLabel = (value: string | null): string => {
  if (!value) return 'Line height'
  return (
    bodyLineHeightLabelByValue[value as ResumeBodyLineHeight] ?? 'Line height'
  )
}

export const resolveBodyLetterSpacingLabel = (value: string | null): string => {
  if (!value) return 'Letter spacing'
  return (
    bodyLetterSpacingLabelByValue[value as ResumeBodyLetterSpacing] ??
    'Letter spacing'
  )
}
