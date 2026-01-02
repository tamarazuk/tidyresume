import { useEffect, useRef } from 'react'
import { useResumeStore } from '@/stores/resume-store'

export function usePrintTitle() {
  const resumeTitle = useResumeStore((state) => state.resumeTitle)
  const originalTitle = useRef<string | null>(null)

  useEffect(() => {
    if (originalTitle.current === null) {
      originalTitle.current = document.title
    }
  }, [])

  useEffect(() => {
    const baseTitle = originalTitle.current ?? document.title

    const handleBeforePrint = () => {
      document.title = resumeTitle || baseTitle
    }

    const handleAfterPrint = () => {
      document.title = baseTitle
    }

    window.addEventListener('beforeprint', handleBeforePrint)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint)
      window.removeEventListener('afterprint', handleAfterPrint)
      document.title = baseTitle
    }
  }, [resumeTitle])
}
