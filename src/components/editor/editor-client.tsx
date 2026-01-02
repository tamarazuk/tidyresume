'use client'

import dynamic from 'next/dynamic'
import EditorLoading from '@/components/editor/editor-loading'

const MarkdownEditor = dynamic(() => import('@/components/editor/editor'), {
  ssr: false,
  loading: () => <EditorLoading />,
})

export default function EditorClient() {
  return <MarkdownEditor />
}
