import type { ReactNode } from 'react'
import Header from '@/components/layout/header'

interface EditorLayoutProps {
  children: ReactNode
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
