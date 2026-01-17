import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getResumeUrl(id: string | null, slug: string | null) {
  if (!slug && !id) return '#'
  return `/r/${slug || id}`
}
