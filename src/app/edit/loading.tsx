import EditorLoading from '@/components/editor/editor-loading'

export default function EditorRouteLoading() {
  return (
    <main className="editor-page flex h-full w-full flex-1 flex-col">
      <div className="min-h-0 flex-1">
        <EditorLoading />
      </div>
    </main>
  )
}
