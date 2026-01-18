import type {
  ResumeBodySize,
  ResumeFont,
  ResumeHeadingSize,
} from '@/types/resume'
import {
  RESUME_BODY_SIZE_OPTIONS,
  RESUME_FONT_OPTIONS,
  RESUME_HEADING_SIZE_OPTIONS,
} from '@/lib/resume-theme'

export const accentHelpText = 'Applied to section headings and links.'

export const fontLabelByValue = RESUME_FONT_OPTIONS.reduce<
  Record<ResumeFont, string>
>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {} as Record<ResumeFont, string>)

export const headingSizeLabelByValue = RESUME_HEADING_SIZE_OPTIONS.reduce<
  Record<ResumeHeadingSize, string>
>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {} as Record<ResumeHeadingSize, string>)

export const bodySizeLabelByValue = RESUME_BODY_SIZE_OPTIONS.reduce<
  Record<ResumeBodySize, string>
>((acc, option) => {
  acc[option.value] = option.label
  return acc
}, {} as Record<ResumeBodySize, string>)

export const legacyHeadingSizeLabelByValue: Record<string, string> = {
  14: 'Small',
  15: 'Medium',
  16: 'Large',
}

export const legacyBodySizeLabelByValue: Record<string, string> = {
  sm: '14 px',
  md: '15 px',
  lg: '16 px',
}
