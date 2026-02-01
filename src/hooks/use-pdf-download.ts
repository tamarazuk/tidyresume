'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function usePdfDownload() {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async (resumeId: string, filename?: string) => {
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
      a.download = filename ? `${filename}.pdf` : 'resume.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

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
