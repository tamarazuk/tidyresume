'use client'

import { useState } from 'react'

import { OwnerFloatingToolbar } from '@/components/public-view/owner-floating-toolbar'
import { ResumeViewer } from '@/components/public-view/resume-viewer'
import { useRemoteStatus } from '@/hooks/use-remote-status'

interface PublicResumeViewProps {
  id: string
  title: string
  content: string
}

export function PublicResumeView({
  id,
  title,
  content,
}: PublicResumeViewProps) {
  const [isFullWidth, setIsFullWidth] = useState(false)
  useRemoteStatus()

  return (
    <>
      <OwnerFloatingToolbar
        id={id}
        isFullWidth={isFullWidth}
        onToggleWidth={() => setIsFullWidth((prev) => !prev)}
      />
      <ResumeViewer
        id={id}
        title={title}
        content={content}
        isFullWidth={isFullWidth}
      />
    </>
  )
}
