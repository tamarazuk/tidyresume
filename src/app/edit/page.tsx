import EditorClient from '@/components/editor/editor-client'

export default function EditorPage() {
  return (
    <main className="editor-page flex h-full w-full flex-1 flex-col">
      <div className="min-h-0 flex-1">
        <EditorClient />
      </div>
    </main>
  )
}
