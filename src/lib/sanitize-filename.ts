/**
 * Sanitizes a filename by removing characters that are invalid for filesystems.
 * Returns 'resume.pdf' as the default filename if the input is empty or invalid.
 */
export function sanitizeFilename(filename: string | undefined): string {
  if (!filename) return 'resume.pdf'

  // Remove characters invalid for filesystems: / \ ? % * : | " < >
  let sanitized = filename.replace(/[/\\?%*:|"<>]/g, '')

  // Trim whitespace
  sanitized = sanitized.trim()

  // If empty after sanitization, use default
  if (!sanitized) return 'resume.pdf'

  // Ensure it ends with .pdf
  if (!sanitized.toLowerCase().endsWith('.pdf')) {
    sanitized = `${sanitized}.pdf`
  }

  return sanitized
}
