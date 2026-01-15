'use client'

import { useState } from 'react'

import { OwnerActionHeader } from '@/components/public-view/owner-action-header'
import { ResumeViewer } from '@/components/public-view/resume-viewer'

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

  return (
    <>
      <OwnerActionHeader
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
