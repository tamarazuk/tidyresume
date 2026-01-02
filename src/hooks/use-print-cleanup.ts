import { useEffect } from 'react'

export function usePrintCleanup() {
  useEffect(() => {
    const handleBeforePrint = () => {
      document.querySelectorAll('.md-editor-preview p').forEach((p) => {
        const onlyBr = p.children.length === 1 && p.children[0].tagName === 'BR'
        if (onlyBr || p.textContent?.trim() === '') p.remove()
      })
    }

    window.addEventListener('beforeprint', handleBeforePrint)
    return () => window.removeEventListener('beforeprint', handleBeforePrint)
  }, [])
}
