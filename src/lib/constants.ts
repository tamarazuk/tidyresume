export const RESUME_TITLE_MAX_LENGTH = 120
export const DEFAULT_RESUME_TITLE = 'Untitled Resume'
export const FOCUS_TITLE_EVENT = 'tidyresume:focus-title'

/**
 * App version used for cache busting assets like the static logo icon.
 * Update this whenever brand assets change (e.g., changing colors or rounding).
 * This ensures email clients and CDNs invalidate cached versions of the logo icon.
 * It is automatically appended to logo icon URLs in email templates (e.g., /logo-icon.svg?v=1).
 */
export const APP_VERSION = '1'

/**
 * Returns the base URL of the application based on the environment.
 * Priority: NEXT_PUBLIC_APP_URL > localhost (dev) > Production Fallback
 */
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT ?? '3000'
    return `http://localhost:${port}`
  }

  return 'https://tidyresume.tzuk.app'
}
