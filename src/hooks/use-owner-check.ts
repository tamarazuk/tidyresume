import { useResumeStore } from '@/stores/resume-store'

export function useOwnerCheck(viewId: string) {
  const draft = useResumeStore((state) => state.getDraftByRemoteId(viewId))
  const isOwner = Boolean(
    draft &&
      draft.id === viewId &&
      draft.editSecret
  )

  return {
    isOwner,
    draftId: isOwner ? draft?.draftId : undefined,
  }
}
