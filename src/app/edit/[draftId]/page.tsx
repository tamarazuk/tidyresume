import EditorClient from '@/components/editor/editor-client'

export default async function EditorDraftPage({
  params,
}: {
  params: Promise<{ draftId: string }>
}) {
  const { draftId } = await params

  return (
    <main className="editor-page flex h-full w-full flex-1 flex-col">
      <div className="min-h-0 flex-1">
        <EditorClient routeDraftId={draftId} />
      </div>
    </main>
  )
}
