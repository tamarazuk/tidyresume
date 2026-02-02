'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { sanitizeFilename } from '@/lib/sanitize-filename'

// Re-export for backwards compatibility with existing imports
export { sanitizeFilename } from '@/lib/sanitize-filename'

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async (resumeId: string, filename?: string) => {
    if (isDownloading) return

    setIsDownloading(true)
    try {
      const response = await fetch(`/api/resumes/${resumeId}/pdf`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = sanitizeFilename(filename)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // Delay URL revocation to ensure browser finishes reading the blob
      setTimeout(() => URL.revokeObjectURL(url), 100)

      toast.success('PDF downloaded')
    } catch (error) {
      console.error('PDF download failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to download PDF'
      )
    } finally {
      setIsDownloading(false)
    }
  }

  return { isDownloading, downloadPdf }
}
