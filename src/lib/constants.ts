export const RESUME_TITLE_MAX_LENGTH = 120
export const DEFAULT_RESUME_TITLE = 'Untitled Resume'
export const FOCUS_TITLE_EVENT = 'tidyresume:focus-title'

/**
 * App version used for cache busting assets like logos.
 * Update this whenever the brand assets change (e.g., changing colors or rounding).
 * This ensures that email clients and CDNs invalidate their cached versions of the PNG logo.
 * It is automatically appended to logo URLs in email templates (e.g., /logo?v=1).
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
    return 'http://localhost:3025'
  }

  return 'https://tidyresume.tzuk.app'
}
